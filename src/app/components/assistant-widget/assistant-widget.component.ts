import { Component, inject, signal, effect, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Store } from '@ngxs/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { AssistantControllerService } from '../../../api/services';
import { Turn } from '../../../api/models';
import { SecurityState } from '../state/security.state';
import { FloatingPanelsService } from '../../shared/chat/floating-panels.service';
import { MessageComposerComponent } from '../../shared/chat/message-composer.component';

// The backend accepts at most 10 earlier turns per question.
const MAX_HISTORY = 10;

interface AssistantMessage {
  role: 'user' | 'assistant';
  content: string;
  error?: boolean;
}

/** The read-only AI assistant, in the corner panel; opens from the corner button's menu. */
@Component({
    selector: 'app-assistant-widget',
    imports: [MatIconModule, MatButtonModule, TranslocoModule, MessageComposerComponent],
    templateUrl: './assistant-widget.component.html',
    styleUrl: './assistant-widget.component.sass'
})
export class AssistantWidgetComponent implements AfterViewChecked {
  @ViewChild('messagesEnd') private messagesEnd?: ElementRef;

  private store = inject(Store);
  private assistantService = inject(AssistantControllerService);
  private transloco = inject(TranslocoService);
  panels = inject(FloatingPanelsService);

  currentUser = toSignal(this.store.select(SecurityState.getCurrentUser));

  messages = signal<AssistantMessage[]>([]);
  newMessage = signal('');
  sending = signal(false);
  remainingToday = signal<number | null>(null);
  readonly examples = ['assistant.example1', 'assistant.example2', 'assistant.example3'];

  private lastMessageCount = 0;
  private lastUserId?: number;

  constructor() {
    // Another account must not see the previous user's conversation.
    effect(() => {
      const userId = this.currentUser()?.id;
      if (userId !== this.lastUserId) {
        this.lastUserId = userId;
        this.messages.set([]);
        this.remainingToday.set(null);
        this.panels.assistantOpen.set(false);
      }
    });
  }

  /** The example questions are buttons: one tap asks it. */
  askExample(key: string) {
    this.send(this.transloco.translate(key).replace(/^[„"]|[”"]$/g, ''));
  }

  send(content: string) {
    if (!content || this.sending()) return;

    const history: Turn[] = this.messages()
      .filter(m => !m.error)
      .slice(-MAX_HISTORY)
      .map(m => ({ role: m.role, content: m.content }));

    this.messages.update(messages => [...messages, { role: 'user', content }]);
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
