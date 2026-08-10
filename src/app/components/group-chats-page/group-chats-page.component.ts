import {
  Component, OnInit, OnDestroy, inject, signal,
  ViewChild, ElementRef, AfterViewChecked
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngxs/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoModule } from '@jsverse/transloco';
import { RouterModule } from '@angular/router';
import { WebSocketService } from '../../core/websocket/websocket.service';
import {
  ClearCourseMessagesAction, CourseSummary,
  LoadCourseMessagesAction, LoadMyChatCoursesAction, SendCourseMessageAction
} from '../state/group-chat.actions';
import { SecurityState } from '../state/security.state';

@Component({
    selector: 'app-group-chats-page',
    imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, TranslocoModule, RouterModule],
    templateUrl: './group-chats-page.component.html',
    styleUrl: './group-chats-page.component.sass'
})
export class GroupChatsPageComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messagesEnd') private messagesEnd?: ElementRef;

  private store      = inject(Store);
  private wsService  = inject(WebSocketService);

  readonly s3Base = 'https://picturesbeautyapplication.s3.eu-central-1.amazonaws.com/';

  myChatCourses = toSignal(this.store.select(state => state.groupChat.myChatCourses), { initialValue: [] as CourseSummary[] });
  messages      = toSignal(this.store.select(state => state.groupChat.messages),      { initialValue: [] });
  currentUser   = toSignal(this.store.select(SecurityState.getCurrentUser));

  selectedCourse = signal<CourseSummary | null>(null);
  newMessage     = signal('');
  private lastCount = 0;

  ngOnInit(): void {
    this.store.dispatch(new LoadMyChatCoursesAction());
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
    this.lastCount = 0;
    this.store.dispatch(new LoadCourseMessagesAction(course.id));
    this.wsService.subscribeToCourse(course.id);
  }

  send(): void {
    const content = this.newMessage().trim();
    const course  = this.selectedCourse();
    if (!content || !course) return;
    this.store.dispatch(new SendCourseMessageAction(course.id, content));
    this.newMessage.set('');
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }

  avatarUrl(fileName?: string): string | null {
    return fileName ? this.s3Base + fileName : null;
  }

  initials(first: string, last: string): string {
    return (first?.[0] ?? '') + (last?.[0] ?? '');
  }

  ngAfterViewChecked(): void {
    const count = this.messages().length;
    if (count !== this.lastCount) {
      this.lastCount = count;
      this.messagesEnd?.nativeElement?.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
