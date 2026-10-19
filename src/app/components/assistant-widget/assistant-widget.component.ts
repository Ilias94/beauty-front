import { Component, inject, signal, effect, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Store } from '@ngxs/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoModule } from '@jsverse/transloco';
import { AssistantControllerService } from '../../../api/services';
import { Turn } from '../../../api/models';
import { CloseChatAction } from '../state/chat.actions';
import { SecurityState } from '../state/security.state';

// The backend accepts at most 10 earlier turns per question.
const MAX_HISTORY = 10;

interface AssistantMessage {
  role: 'user' | 'assistant';
  content: string;
  error?: boolean;
}

@Component({
    selector: 'app-assistant-widget',
    imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, MatTooltipModule, TranslocoModule],
    templateUrl: './assistant-widget.component.html',
    styleUrl: './assistant-widget.component.sass'
})
export class AssistantWidgetComponent implements AfterViewChecked {
  @ViewChild('messagesEnd') private messagesEnd?: ElementRef;

  private store = inject(Store);
  private assistantService = inject(AssistantControllerService);

  currentUser = toSignal(this.store.select(SecurityState.getCurrentUser));
  chatOpen = toSignal(this.store.select(state => state.chat.open), { initialValue: false });

  open = signal(false);
  messages = signal<AssistantMessage[]>([]);
  newMessage = signal('');
  sending = signal(false);
  remainingToday = signal<number | null>(null);

  private lastMessageCount = 0;
  private lastUserId?: number;

  constructor() {
    // Both widgets share the bottom-right corner, so only one panel is open at a time.
    effect(() => {
      if (this.chatOpen()) {
        this.open.set(false);
      }
    });
    // Another account must not see the previous user's conversation.
    effect(() => {
      const userId = this.currentUser()?.id;
      if (userId !== this.lastUserId) {
        this.lastUserId = userId;
        this.messages.set([]);
        this.remainingToday.set(null);
        this.open.set(false);
      }
    });
  }

  toggleOpen() {
    if (!this.open()) {
      this.store.dispatch(new CloseChatAction());
    }
    this.open.update(open => !open);
  }

  send() {
    const content = this.newMessage().trim();
    if (!content || this.sending()) return;

    const history: Turn[] = this.messages()
      .filter(m => !m.error)
      .slice(-MAX_HISTORY)
      .map(m => ({ role: m.role, content: m.content }));

    this.messages.update(messages => [...messages, { role: 'user', content }]);
    this.newMessage.set('');
    this.sending.set(true);

    this.assistantService.ask({ body: { message: content, history } }).subscribe({
      next: response => {
        this.messages.update(messages => [...messages, { role: 'assistant', content: response.answer ?? '' }]);
        this.remainingToday.set(response.remainingToday ?? null);
        this.sending.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.messages.update(messages => [...messages, { role: 'assistant', content: this.errorKey(error), error: true }]);
        if (error.status === 429) {
          this.remainingToday.set(0);
        }
        this.sending.set(false);
      }
    });
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }

  private errorKey(error: HttpErrorResponse): string {
    switch (error.status) {
      case 429: return 'assistant.limitReached';
      case 503: return 'assistant.disabled';
      default: return 'assistant.error';
    }
  }

  ngAfterViewChecked() {
    const count = this.messages().length + (this.sending() ? 1 : 0);
    if (count !== this.lastMessageCount) {
      this.lastMessageCount = count;
      this.messagesEnd?.nativeElement?.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
