import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { tap } from 'rxjs';
import { ChatApiService } from '../../services/chat-api.service';
import {
  BackToListAction, ChatConversation, ChatMessage,
  CloseChatAction, LoadConversationsAction, LoadMessagesAction,
  MarkConversationReadAction, OpenChatAction, ReceiveMessageAction, SendMessageAction
} from './chat.actions';

export interface ChatStateModel {
  open: boolean;
  conversations: ChatConversation[];
  activePartnerId: number | null;
  messages: ChatMessage[];
}

const defaults: ChatStateModel = {
  open: false,
  conversations: [],
  activePartnerId: null,
  messages: [],
};

@State<ChatStateModel>({ name: 'chat', defaults })
@Injectable()
export class ChatState {

  constructor(private api: ChatApiService) {}

  @Selector()
  static unreadTotal(state: ChatStateModel): number {
    return state.conversations.reduce((sum, c) => sum + c.unreadCount, 0);
  }

  @Action(LoadConversationsAction)
  loadConversations({ patchState }: StateContext<ChatStateModel>) {
    return this.api.getConversations().pipe(
      tap(conversations => patchState({ conversations }))
    );
  }

  @Action(LoadMessagesAction)
  loadMessages({ patchState }: StateContext<ChatStateModel>, { partnerId }: LoadMessagesAction) {
    patchState({ activePartnerId: partnerId, messages: [] });
    return this.api.getMessages(partnerId).pipe(
      tap(messages => patchState({ messages }))
    );
  }

  @Action(SendMessageAction)
  send({ getState, patchState }: StateContext<ChatStateModel>, { recipientId, content }: SendMessageAction) {
    return this.api.send(recipientId, content).pipe(
      tap(message => {
        const state = getState();
        patchState({ messages: [...state.messages, message] });
        const exists = state.conversations.some(c => c.partnerId === recipientId);
        if (exists) {
          patchState({
            conversations: state.conversations.map(c =>
              c.partnerId === recipientId
                ? { ...c, lastMessage: message.content, lastMessageAt: message.sentAt }
                : c
            )
          });
        }
      })
    );
  }

  @Action(MarkConversationReadAction)
  markRead({ getState, patchState }: StateContext<ChatStateModel>, { partnerId }: MarkConversationReadAction) {
    return this.api.markAsRead(partnerId).pipe(
      tap(() => {
        const conversations = getState().conversations.map(c =>
          c.partnerId === partnerId ? { ...c, unreadCount: 0 } : c
        );
        patchState({ conversations });
      })
    );
  }

  @Action(ReceiveMessageAction)
  receiveMessage({ getState, patchState, dispatch }: StateContext<ChatStateModel>, { message }: ReceiveMessageAction) {
    const state = getState();
    const inList = state.conversations.some(c => c.partnerId === message.senderId);

    if (!inList) {
      // First message from this person — refresh conversations to get their name/avatar
      dispatch(new LoadConversationsAction());
      if (state.activePartnerId === message.senderId) {
        patchState({ messages: [...state.messages, message] });
      }
      return;
    }

    const messages = state.activePartnerId === message.senderId
      ? [...state.messages, message]
      : state.messages;

    const conversations = state.conversations.map(c =>
      c.partnerId === message.senderId
        ? { ...c, lastMessage: message.content, lastMessageAt: message.sentAt,
            unreadCount: state.activePartnerId === message.senderId ? 0 : c.unreadCount + 1 }
        : c
    );

    patchState({ messages, conversations });
  }

  @Action(OpenChatAction)
  open({ getState, patchState, dispatch }: StateContext<ChatStateModel>, action: OpenChatAction) {
    patchState({ open: true });
    if (action.partnerId != null) {
      // Insert a placeholder so the header renders immediately if this is a new conversation
      const state = getState();
      const exists = state.conversations.some(c => c.partnerId === action.partnerId);
      if (!exists && action.partnerFirstName) {
        patchState({
          conversations: [
            ...state.conversations,
            {
              partnerId: action.partnerId,
              partnerFirstName: action.partnerFirstName,
              partnerLastName: action.partnerLastName ?? '',
              partnerFileName: action.partnerFileName,
              lastMessage: '',
              lastMessageAt: new Date().toISOString(),
              unreadCount: 0,
            }
          ]
        });
      }
      dispatch(new LoadMessagesAction(action.partnerId));
    } else {
      patchState({ activePartnerId: null, messages: [] });
      dispatch(new LoadConversationsAction());
    }
  }

  @Action(BackToListAction)
  backToList({ patchState, dispatch }: StateContext<ChatStateModel>) {
    patchState({ activePartnerId: null, messages: [] });
    return dispatch(new LoadConversationsAction());
  }

  @Action(CloseChatAction)
  close({ patchState }: StateContext<ChatStateModel>) {
    patchState({ open: false, activePartnerId: null, messages: [] });
  }
}
