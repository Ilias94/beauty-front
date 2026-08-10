// core/websocket/websocket.service.ts
import { Injectable } from '@angular/core';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import { Store } from '@ngxs/store';
import { NotificationService } from '../notification/notification.service';
import { environment } from '../../../environments/enfironment';
import { AddNotificationAction } from '../../components/state/notification.actions';
import { ReceiveMessageAction } from '../../components/state/chat.actions';
import { ReceiveCourseMessageAction } from '../../components/state/group-chat.actions';

@Injectable({ providedIn: 'root' })
export class WebSocketService {

  private client?: Client;
  private subscription?: StompSubscription;
  private chatSubscription?: StompSubscription;
  private courseSubscription?: StompSubscription;
  private pendingCourseId?: number;

  constructor(private store: Store, private notificationService: NotificationService) { }

  connect(): void {
    console.log('🔌 WS connect() called');

    if (this.client?.active) {
      console.log('⚠️ WS client already active, skipping connect');
      return;
    }

    const token = this.store.selectSnapshot(state => state.security.token);
    console.log('🔑 WS token:', token);

    if (!token) {
      console.warn('❌ WS connect aborted: no token');
      return;
    }

    this.client = new Client({
      brokerURL: `${environment.wsUrl}`,
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      debug: str => console.log('[WS debug]', str),
      reconnectDelay: 5000,
      onStompError: frame => {
        console.error('❌ WS Stomp error:', frame);
      }
    });

    this.client.onConnect = () => {
      console.log('🟢 WS connected');

      if (!this.subscription) {
        this.subscription = this.client?.subscribe('/user/queue/notifications', (msg: IMessage) => {
          console.log('🔔 WS Notification received:', msg.body);
          try {
            const parsed = JSON.parse(msg.body);
            const title: string | undefined = parsed?.title;
            const text: string = parsed?.message ?? msg.body;
            this.store.dispatch(new AddNotificationAction(title, text));
            this.notificationService.show(text);
          } catch {
            this.store.dispatch(new AddNotificationAction(undefined, msg.body));
            this.notificationService.show(msg.body);
          }
        });

        console.log('📌 WS subscription set to /user/queue/notifications');

        this.chatSubscription = this.client?.subscribe('/user/queue/chat', (msg: IMessage) => {
          try {
            const message = JSON.parse(msg.body);
            this.store.dispatch(new ReceiveMessageAction(message));
          } catch {
            console.error('❌ WS chat parse error', msg.body);
          }
        });
      }

      if (this.pendingCourseId != null) {
        this.doSubscribeToCourse(this.pendingCourseId);
      }
    };

    this.client.onDisconnect = () => {
      console.log('🔴 WS disconnected');
      this.subscription = undefined;
      this.chatSubscription = undefined;
      this.courseSubscription = undefined;
    };

    this.client.activate();
    console.log('🚀 WS client activated');
  }

  subscribeToCourse(courseId: number): void {
    this.pendingCourseId = courseId;
    if (this.client?.active) {
      this.doSubscribeToCourse(courseId);
    }
  }

  unsubscribeFromCourse(): void {
    this.courseSubscription?.unsubscribe();
    this.courseSubscription = undefined;
    this.pendingCourseId = undefined;
  }

  private doSubscribeToCourse(courseId: number): void {
    this.courseSubscription?.unsubscribe();
    this.courseSubscription = this.client?.subscribe(`/topic/course/${courseId}`, (msg: IMessage) => {
      try {
        const message = JSON.parse(msg.body);
        this.store.dispatch(new ReceiveCourseMessageAction(message));
      } catch {
        console.error('❌ WS group chat parse error', msg.body);
      }
    });
    console.log(`📌 WS subscribed to /topic/course/${courseId}`);
  }

  disconnect(): void {
    if (!this.client) {
      console.warn('⚠️ WS disconnect called but client is undefined');
      return;
    }

    console.log('🛑 WS disconnect called');
    this.client.deactivate();
    this.client = undefined;
    this.subscription = undefined;
    this.courseSubscription = undefined;
    this.pendingCourseId = undefined;
  }
}
