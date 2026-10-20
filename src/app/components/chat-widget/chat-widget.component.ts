import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { Store } from '@ngxs/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoModule } from '@jsverse/transloco';
import {
  BackToListAction, ChatContact, ChatConversation, ChatMessage, LoadMessagesAction,
  MarkConversationReadAction, OpenChatAction, SendMessageAction
} from '../state/chat.actions';
import { SecurityState } from '../state/security.state';
import { ChatApiService } from '../../services/chat-api.service';
import { FloatingPanelsService } from '../../shared/chat/floating-panels.service';
import { MessageThreadComponent } from '../../shared/chat/message-thread.component';
import { MessageComposerComponent } from '../../shared/chat/message-composer.component';
import { ThreadMessage } from '../../shared/chat/thread';
import { S3_BASE } from '../../app.const';

/** Private messages: conversation list, contact picker and the conversation itself, in the corner panel. */
@Component({
    selector: 'app-chat-widget',
    imports: [FormsModule, RouterLink, MatIconModule, MatButtonModule, MatTooltipModule, TranslocoModule,
        MessageThreadComponent, MessageComposerComponent],
    templateUrl: './chat-widget.component.html',
    styleUrl: './chat-widget.component.sass'
})
export class ChatWidgetComponent {
  private store = inject(Store);
  private api = inject(ChatApiService);
  panels = inject(FloatingPanelsService);

  open          = toSignal(this.store.select(state => state.chat.open),            { initialValue: false });
  conversations = toSignal(this.store.select(state => state.chat.conversations),   { initialValue: [] as ChatConversation[] });
  activeId      = toSignal(this.store.select(state => state.chat.activePartnerId), { initialValue: null as number | null });
  messages      = toSignal(this.store.select(state => state.chat.messages),        { initialValue: [] as ChatMessage[] });
  courseContext = toSignal(this.store.select(state => state.chat.courseContext),   { initialValue: null });
  currentUser   = toSignal(this.store.select(SecurityState.getCurrentUser));

  activePartner = computed(() => this.conversations().find(c => c.partnerId === this.activeId()));

  threadMessages = computed<ThreadMessage[]>(() => {
    const me = this.currentUser()?.id;
    return this.messages().map(m => ({
      id: m.id,
      mine: m.senderId === me,
      authorId: m.senderId,
      content: m.content,
      sentAt: m.sentAt,
      read: m.read,
      course: m.courseId && m.courseTitle ? { id: m.courseId, title: m.courseTitle } : null,
    }));
  });

  newMessage = signal('');
  /** Why the last message couldn't be sent (translation key), shown above the input. */
  sendError = signal<string | null>(null);

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

  close() {
    this.picking.set(false);
    this.panels.closeAll();
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

  /** "Prowadzi: Stylizacja rzęs" / "Uczestniczy w: Manicure +1". */
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

  send(content: string) {
    const partner = this.activeId();
    if (!partner) return;
    this.sendError.set(null);
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

  avatarUrl(fileName?: string | null): string | null {
    return fileName ? S3_BASE + fileName : null;
  }

  initials(first: string, last: string): string {
    return ((first?.[0] ?? '') + (last?.[0] ?? '')).toUpperCase();
  }
}
