import { Component, ElementRef, ViewChild, computed, effect, inject, input, signal, ChangeDetectionStrategy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { toSignal } from '@angular/core/rxjs-interop';
import { ThreadMessage, buildThread } from './thread';

/**
 * The message list shared by every chat: day separators, a "new messages" divider, messages
 * grouped per person, read status for private messages, links and large emoji. Keeps itself
 * scrolled to the latest message unless the reader has scrolled up.
 */
@Component({
    selector: 'app-message-thread',
    imports: [DatePipe, RouterLink, MatIconModule, TranslocoModule],
    templateUrl: './message-thread.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './message-thread.component.sass'
})
export class MessageThreadComponent {
  @ViewChild('scroller', { static: true }) private scroller!: ElementRef<HTMLElement>;

  messages = input.required<ThreadMessage[]>();
  /** Group chats: show each person's avatar and name. */
  showAuthors = input(false);
  /** Private messages: ticks under your own messages and the "new messages" divider. */
  showReadStatus = input(false);
  emptyIcon = input('chat_bubble_outline');
  emptyText = input('');

  private transloco = inject(TranslocoService);
  private lang = toSignal(this.transloco.langChanges$, { initialValue: this.transloco.getActiveLang() });

  items = computed(() => buildThread(this.messages(), day => this.dayLabel(day), this.showReadStatus()));

  /** The reader scrolled up to read history: don't pull them down, offer a button instead. */
  awayFromBottom = signal(false);
  private renderedCount = 0;

  constructor() {
    effect(() => {
      const messages = this.messages();
      const previous = this.renderedCount;
      this.renderedCount = messages.length;
      if (!messages.length) return;
      const lastIsMine = messages[messages.length - 1].mine;
      requestAnimationFrame(() => {
        if (previous === 0) {
          this.scrollToFirstUnreadOrBottom();
        } else if (!this.awayFromBottom() || lastIsMine) {
          this.scrollToBottom(true);
        }
      });
    });
  }

  onScroll(): void {
    const el = this.scroller.nativeElement;
    this.awayFromBottom.set(el.scrollHeight - el.scrollTop - el.clientHeight > 120);
  }

  scrollToBottom(smooth = false): void {
    const el = this.scroller.nativeElement;
    el.scrollTo({ top: el.scrollHeight, behavior: smooth ? 'smooth' : 'auto' });
  }

  private scrollToFirstUnreadOrBottom(): void {
    const divider = this.scroller.nativeElement.querySelector<HTMLElement>('.unread-divider');
    if (divider) {
      divider.scrollIntoView({ block: 'center' });
    } else {
      this.scrollToBottom();
    }
  }

  private dayLabel(day: string): string {
    const today = new Date();
    const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (day === iso(today)) return this.transloco.translate('chat.today');
    if (day === iso(yesterday)) return this.transloco.translate('chat.yesterday');
    const date = new Date(day + 'T12:00:00');
    const locale = this.lang() === 'en' ? 'en-GB' : 'pl-PL';
    return new Intl.DateTimeFormat(locale, {
      weekday: 'long', day: 'numeric', month: 'long',
      ...(date.getFullYear() !== today.getFullYear() ? { year: 'numeric' } : {}),
    }).format(date);
  }
}
