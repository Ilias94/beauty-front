import { Component, Input, OnInit, OnDestroy, computed, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngxs/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoModule } from '@jsverse/transloco';
import { WebSocketService } from '../../core/websocket/websocket.service';
import { ClearCourseMessagesAction, CourseMessage, LoadCourseMessagesAction, SendCourseMessageAction } from '../state/group-chat.actions';
import { SecurityState } from '../state/security.state';
import { FloatingPanelsService } from '../../shared/chat/floating-panels.service';
import { MessageThreadComponent } from '../../shared/chat/message-thread.component';
import { MessageComposerComponent } from '../../shared/chat/message-composer.component';
import { groupMessagesToThread } from '../../shared/chat/thread';
import { S3_BASE } from '../../app.const';

/**
 * A course's group chat on its page, for the owner and participants. It has no button of its
 * own: it registers with FloatingPanelsService and opens from the corner button's menu.
 */
@Component({
    selector: 'app-course-group-chat',
    imports: [MatIconModule, MatButtonModule, TranslocoModule, MessageThreadComponent, MessageComposerComponent],
    changeDetection: ChangeDetectionStrategy.Eager,
    templateUrl: './course-group-chat.component.html',
})
export class CourseGroupChatComponent implements OnInit, OnDestroy {
  @Input({ required: true }) courseId!: number;
  @Input() courseTitle = '';

  private store = inject(Store);
  private wsService = inject(WebSocketService);
  panels = inject(FloatingPanelsService);

  private messages = toSignal(this.store.select(state => state.groupChat.messages), { initialValue: [] as CourseMessage[] });
  private currentUser = toSignal(this.store.select(SecurityState.getCurrentUser));

  threadMessages = computed(() => groupMessagesToThread(this.messages(), this.currentUser()?.id, S3_BASE));
  newMessage = signal('');

  ngOnInit(): void {
    this.store.dispatch(new LoadCourseMessagesAction(this.courseId));
    this.wsService.subscribeToCourse(this.courseId);
    this.panels.registerGroupChat(this, this.courseId, this.courseTitle);
  }

  ngOnDestroy(): void {
    this.panels.unregisterGroupChat(this);
    this.wsService.unsubscribeFromCourse();
    this.store.dispatch(new ClearCourseMessagesAction());
  }

  send(content: string): void {
    this.store.dispatch(new SendCourseMessageAction(this.courseId, content));
  }
}
