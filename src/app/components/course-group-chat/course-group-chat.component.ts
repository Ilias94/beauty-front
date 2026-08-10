import {
  Component, Input, OnInit, OnDestroy, inject, signal,
  ViewChild, ElementRef, AfterViewChecked
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngxs/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoModule } from '@jsverse/transloco';
import { WebSocketService } from '../../core/websocket/websocket.service';
import { ClearCourseMessagesAction, LoadCourseMessagesAction, SendCourseMessageAction } from '../state/group-chat.actions';
import { SecurityState } from '../state/security.state';

@Component({
  selector: 'app-course-group-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, MatTooltipModule, TranslocoModule],
  templateUrl: './course-group-chat.component.html',
  styleUrl: './course-group-chat.component.sass',
})
export class CourseGroupChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @Input({ required: true }) courseId!: number;
  @Input() courseTitle = '';
  @ViewChild('messagesEnd') private messagesEnd?: ElementRef;

  private store = inject(Store);
  private wsService = inject(WebSocketService);

  readonly s3Base = 'https://picturesbeautyapplication.s3.eu-central-1.amazonaws.com/';

  messages    = toSignal(this.store.select(state => state.groupChat.messages), { initialValue: [] });
  currentUser = toSignal(this.store.select(SecurityState.getCurrentUser));

  open       = signal(false);
  newMessage = signal('');
  private lastCount = 0;

  ngOnInit(): void {
    this.store.dispatch(new LoadCourseMessagesAction(this.courseId));
    this.wsService.subscribeToCourse(this.courseId);
  }

  ngOnDestroy(): void {
    this.wsService.unsubscribeFromCourse();
    this.store.dispatch(new ClearCourseMessagesAction());
  }

  toggle(): void {
    this.open.update(v => !v);
  }

  send(): void {
    const content = this.newMessage().trim();
    if (!content) return;
    this.store.dispatch(new SendCourseMessageAction(this.courseId, content));
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
