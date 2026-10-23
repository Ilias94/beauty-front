export class LoadConversationsAction {
  static readonly type = '[Chat] Load Conversations';
}

export class LoadMessagesAction {
  static readonly type = '[Chat] Load Messages';
  constructor(public partnerId: number) {}
}

export class SendMessageAction {
  static readonly type = '[Chat] Send Message';
  constructor(public recipientId: number, public content: string) {}
}

export class MarkConversationReadAction {
  static readonly type = '[Chat] Mark Conversation Read';
  constructor(public partnerId: number) {}
}

export class ReceiveMessageAction {
  static readonly type = '[Chat] Receive Message (WS)';
  constructor(public message: ChatMessage) {}
}

export class OpenChatAction {
  static readonly type = '[Chat] Open';
  constructor(
    public partnerId?: number,
    public partnerFirstName?: string,
    public partnerLastName?: string,
    public partnerFileName?: string,
    /** The course the conversation starts from (e.g. "Napisz do instruktorki" on its page). */
    public course?: ChatCourseContext,
  ) {}
}

export class BackToListAction {
  static readonly type = '[Chat] Back to List';
}

export class CloseChatAction {
  static readonly type = '[Chat] Close';
}

// Inline interfaces — replace imports with src/api/models after openapi-generate
export interface ChatMessage {
  id: number;
  senderId: number;
  recipientId: number;
  content: string;
  sentAt: string;
  read: boolean;
  courseId?: number;
  courseTitle?: string;
}

export interface ChatCourseContext {
  id: number;
  title: string;
}

/** Someone the user can start a conversation with, and the courses that connect them. */
export interface ChatContact {
  id: number;
  firstName: string;
  lastName: string;
  fileName?: string;
  courses: { courseId: number; title: string; role: 'INSTRUCTOR' | 'PARTICIPANT' }[];
}

export interface ChatConversation {
  partnerId: number;
  partnerFirstName: string;
  partnerLastName: string;
  partnerFileName?: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}
