import { Component, inject, signal, computed, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { Store } from '@ngxs/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoModule } from '@jsverse/transloco';
import { ChatState } from '../state/chat.state';
import {
  BackToListAction, ChatContact, CloseChatAction, LoadMessagesAction,
  MarkConversationReadAction, OpenChatAction, SendMessageAction
} from '../state/chat.actions';
import { SecurityState } from '../state/security.state';
import { ChatApiService } from '../../services/chat-api.service';

@Component({
    selector: 'app-chat-widget',
    imports: [CommonModule, FormsModule, RouterLink, MatIconModule, MatButtonModule, MatBadgeModule, MatTooltipModule, TranslocoModule],
    templateUrl: './chat-widget.component.html',
    styleUrl: './chat-widget.component.sass'
})
export class ChatWidgetComponent implements AfterViewChecked {
  @ViewChild('messagesEnd') private messagesEnd?: ElementRef;

  private store = inject(Store);
  private api = inject(ChatApiService);
  readonly s3Base = 'https://picturesbeautyapplication.s3.eu-central-1.amazonaws.com/';

  open        = toSignal(this.store.select(state => state.chat.open),              { initialValue: false });
  conversations = toSignal(this.store.select(state => state.chat.conversations),   { initialValue: [] });
  activeId    = toSignal(this.store.select(state => state.chat.activePartnerId),   { initialValue: null });
  messages    = toSignal(this.store.select(state => state.chat.messages),          { initialValue: [] });
  courseContext = toSignal(this.store.select(state => state.chat.courseContext),   { initialValue: null });
  unreadTotal = toSignal(this.store.select(ChatState.unreadTotal),                 { initialValue: 0 });
  currentUser = toSignal(this.store.select(SecurityState.getCurrentUser));

  activePartner = computed(() => this.conversations().find(c => c.partnerId === this.activeId()));

  newMessage = signal('');
  /** Why the last message couldn't be sent (translation key), shown above the input. */
  sendError = signal<string | null>(null);
  private lastMessageCount = 0;

  // ── "New message": people the user is connected to through courses ──────
  picking = signal(false);
  contacts = signal<ChatContact[] | null>(null);
  contactQuery = signal('');
  filteredContacts = computed(() => {
    const query = this.contactQuery().trim().toLowerCase();
    const contacts = this.contacts() ?? [];
    if (!query) return contacts;
    return contacts.filter(c => `${c.firstName} ${c.lastName} ${c.courses.map(k => k.title).join(' ')}`.toLowerCase().includes(query));
  });

  toggleOpen() {
    if (this.open()) {
      this.picking.set(false);
      this.store.dispatch(new CloseChatAction());
    } else {
      this.store.dispatch(new OpenChatAction());
    }
  }

  startNew() {
    this.picking.set(true);
    this.contactQuery.set('');
    // Fresh each time: bookings change while the widget is open.
    this.api.getContacts().subscribe({
      next: contacts => this.contacts.set(contacts),
      error: () => this.contacts.set([]),
    });
  }

  pick(contact: ChatContact) {
    this.picking.set(false);
    this.sendError.set(null);
    this.store.dispatch(new OpenChatAction(contact.id, contact.firstName, contact.lastName, contact.fileName));
  }

  /** "Prowadzi: Stylizacja rzęs" / "Uczestniczka: Manicure +1". */
  contactSubtitle(contact: ChatContact): { role: string; title: string; more: number } {
    const first = contact.courses[0];
    return { role: first.role, title: first.title, more: contact.courses.length - 1 };
  }

  openConversation(partnerId: number) {
    this.sendError.set(null);
    this.store.dispatch([
      new LoadMessagesAction(partnerId),
      new MarkConversationReadAction(partnerId),
    ]);
  }

  backToList() {
    this.picking.set(false);
    this.sendError.set(null);
    this.store.dispatch(new BackToListAction());
  }

  send() {
    const content = this.newMessage().trim();
    const partner = this.activeId();
    if (!content || !partner) return;
    this.sendError.set(null);
    this.newMessage.set('');
    this.store.dispatch(new SendMessageAction(partner, content)).subscribe({
      error: (error: HttpErrorResponse) => {
        // Give the text back so nothing typed is lost.
        this.newMessage.set(content);
        this.sendError.set(
          error.status === 403 ? 'chat.errors.forbidden'
          : error.status === 429 ? 'chat.errors.limit'
          : 'chat.errors.generic');
      },
    });
  }

  onKeydown(event: KeyboardEvent) {
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

  ngAfterViewChecked() {
    const count = this.messages().length;
    if (count !== this.lastMessageCount) {
      this.lastMessageCount = count;
      this.messagesEnd?.nativeElement?.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
