import { Component, inject, signal, computed, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngxs/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoModule } from '@jsverse/transloco';
import { ChatState } from '../state/chat.state';
import {
  BackToListAction, CloseChatAction, LoadMessagesAction,
  MarkConversationReadAction, OpenChatAction, SendMessageAction
} from '../state/chat.actions';
import { SecurityState } from '../state/security.state';

@Component({
  selector: 'app-chat-widget',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, MatBadgeModule, MatTooltipModule, TranslocoModule],
  templateUrl: './chat-widget.component.html',
  styleUrl: './chat-widget.component.sass',
})
export class ChatWidgetComponent implements AfterViewChecked {
  @ViewChild('messagesEnd') private messagesEnd?: ElementRef;

  private store = inject(Store);
  readonly s3Base = 'https://picturesbeautyapplication.s3.eu-central-1.amazonaws.com/';

  open        = toSignal(this.store.select(state => state.chat.open),              { initialValue: false });
  conversations = toSignal(this.store.select(state => state.chat.conversations),   { initialValue: [] });
  activeId    = toSignal(this.store.select(state => state.chat.activePartnerId),   { initialValue: null });
  messages    = toSignal(this.store.select(state => state.chat.messages),          { initialValue: [] });
  unreadTotal = toSignal(this.store.select(ChatState.unreadTotal),                 { initialValue: 0 });
  currentUser = toSignal(this.store.select(SecurityState.getCurrentUser));

  activePartner = computed(() => this.conversations().find(c => c.partnerId === this.activeId()));

  newMessage = signal('');
  private lastMessageCount = 0;

  toggleOpen() {
    if (this.open()) {
      this.store.dispatch(new CloseChatAction());
    } else {
      this.store.dispatch(new OpenChatAction());
    }
  }

  openConversation(partnerId: number) {
    this.store.dispatch([
      new LoadMessagesAction(partnerId),
      new MarkConversationReadAction(partnerId),
    ]);
  }

  backToList() {
    this.store.dispatch(new BackToListAction());
  }

  send() {
    const content = this.newMessage().trim();
    const partner = this.activeId();
    if (!content || !partner) return;
    this.store.dispatch(new SendMessageAction(partner, content));
    this.newMessage.set('');
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
