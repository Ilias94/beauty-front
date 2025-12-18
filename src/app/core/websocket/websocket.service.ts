// core/websocket/websocket.service.ts
import { Injectable } from '@angular/core';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import { Store } from '@ngxs/store';

@Injectable({ providedIn: 'root' })
export class WebSocketService {

  private client?: Client;
  private subscription?: StompSubscription;

  constructor(private store: Store) { }

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
      brokerURL: 'ws://localhost:8080/ws',
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      debug: str => console.log('[WS debug]', str),
      reconnectDelay: 5000, // automatyczne próby reconnect co 5s
      onStompError: frame => {
        console.error('❌ WS Stomp error:', frame);
      }
    });

    this.client.onConnect = () => {
      console.log('🟢 WS connected');

      if (this.subscription) {
        console.log('⚠️ WS already subscribed, skipping subscription');
        return;
      }

      this.subscription = this.client?.subscribe('/user/queue/notifications', (msg: IMessage) => {
        console.log('🔔 WS Notification received:', msg.body);
      });

      console.log('📌 WS subscription set to /user/queue/notifications');
    };

    this.client.onDisconnect = () => {
      console.log('🔴 WS disconnected');
      this.subscription = undefined;
    };

    this.client.activate();
    console.log('🚀 WS client activated');
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
  }
}
