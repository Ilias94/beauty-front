import { Component, OnInit, OnDestroy, computed, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngxs/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoModule } from '@jsverse/transloco';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { WebSocketService } from '../../core/websocket/websocket.service';
import {
  ClearCourseMessagesAction, CourseMessage, CourseSummary,
  LoadCourseMessagesAction, LoadMyChatCoursesAction, SendCourseMessageAction
} from '../state/group-chat.actions';
import { SecurityState } from '../state/security.state';
import { MessageThreadComponent } from '../../shared/chat/message-thread.component';
import { MessageComposerComponent } from '../../shared/chat/message-composer.component';
import { groupMessagesToThread } from '../../shared/chat/thread';
import { S3_BASE } from '../../app.const';

@Component({
    selector: 'app-group-chats-page',
    imports: [MatIconModule, MatButtonModule, TranslocoModule, RouterModule, MessageThreadComponent, MessageComposerComponent],
    templateUrl: './group-chats-page.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './group-chats-page.component.sass'
})
export class GroupChatsPageComponent implements OnInit, OnDestroy {
  private store      = inject(Store);
  private wsService  = inject(WebSocketService);
  private route      = inject(ActivatedRoute);

  myChatCourses = toSignal(this.store.select(state => state.groupChat.myChatCourses), { initialValue: [] as CourseSummary[] });
  messages      = toSignal(this.store.select(state => state.groupChat.messages),      { initialValue: [] as CourseMessage[] });
  currentUser   = toSignal(this.store.select(SecurityState.getCurrentUser));

  selectedCourse = signal<CourseSummary | null>(null);
  newMessage     = signal('');
  threadMessages = computed(() => groupMessagesToThread(this.messages(), this.currentUser()?.id, S3_BASE));

  ngOnInit(): void {
    // ?course=<id> (e.g. from the calendar) opens that course's chat straight away.
    const wanted = Number(this.route.snapshot.queryParamMap.get('course'));
    this.store.dispatch(new LoadMyChatCoursesAction()).subscribe(() => {
      const course = wanted ? this.myChatCourses().find(c => c.id === wanted) : undefined;
      if (course) this.selectCourse(course);
    });
  }

  ngOnDestroy(): void {
    this.wsService.unsubscribeFromCourse();
    this.store.dispatch(new ClearCourseMessagesAction());
  }

  selectCourse(course: CourseSummary): void {
    if (this.selectedCourse()?.id === course.id) return;
    this.wsService.unsubscribeFromCourse();
    this.store.dispatch(new ClearCourseMessagesAction());
    this.selectedCourse.set(course);
    this.store.dispatch(new LoadCourseMessagesAction(course.id));
    this.wsService.subscribeToCourse(course.id);
  }

  send(content: string): void {
    const course = this.selectedCourse();
    if (course) this.store.dispatch(new SendCourseMessageAction(course.id, content));
  }
}
