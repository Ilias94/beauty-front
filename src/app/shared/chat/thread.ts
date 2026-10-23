/** One message as every chat in the app shows it (private messages and course group chats). */
export interface ThreadMessage {
  id: number | string;
  mine: boolean;
  authorId: number | string;
  authorName?: string;
  avatarUrl?: string | null;
  initials?: string;
  content: string;
  sentAt: string;
  /** Private messages only: whether the recipient has opened it. */
  read?: boolean;
  /** The course the message is about, when it was sent from a course page. */
  course?: { id: number; title: string } | null;
}

export interface TextPart { text: string; href?: string }

export interface ThreadEntry extends ThreadMessage {
  parts: TextPart[];
  /** Up to three emoji and nothing else: shown large, without a bubble. */
  emojiOnly: boolean;
}

export type ThreadItem =
  | { kind: 'day'; key: string; label: string }
  | { kind: 'unread'; key: string }
  | {
      kind: 'group'; key: string; mine: boolean;
      authorName?: string; avatarUrl?: string | null; initials?: string;
      messages: ThreadEntry[];
      /** All messages in the group were read by the recipient. */
      read: boolean;
    };

/** Messages from one person less than this far apart share a group (one avatar, one time stamp). */
const GROUP_GAP_MS = 5 * 60 * 1000;
const URL_PATTERN = /(https?:\/\/[^\s<]+[^\s<.,:;"')\]!?])/g;
const EMOJI_ONLY = /^(?:\p{Extended_Pictographic}(?:️|‍\p{Extended_Pictographic}|\p{Emoji_Modifier})*\s*){1,3}$/u;

/** Splits text into plain parts and links, so links render as anchors without using innerHTML. */
export function linkify(text: string): TextPart[] {
  const parts: TextPart[] = [];
  let last = 0;
  for (const match of text.matchAll(URL_PATTERN)) {
    const index = match.index ?? 0;
    if (index > last) parts.push({ text: text.slice(last, index) });
    parts.push({ text: match[0], href: match[0] });
    last = index + match[0].length;
  }
  if (last < text.length) parts.push({ text: text.slice(last) });
  return parts;
}

export function isEmojiOnly(text: string): boolean {
  return EMOJI_ONLY.test(text.trim());
}

const dayKey = (iso: string) => iso.slice(0, 10);

/**
 * Turns a flat, chronological list into what the thread renders: day separators, a
 * "new messages" divider before the first unread message from the other person, and
 * groups of consecutive messages from the same person.
 */
export function buildThread(messages: ThreadMessage[], dayLabel: (day: string) => string, markUnread: boolean): ThreadItem[] {
  const items: ThreadItem[] = [];
  let currentDay = '';
  let group: Extract<ThreadItem, { kind: 'group' }> | null = null;
  let lastTime = 0;
  let unreadPlaced = !markUnread;

  for (const message of messages) {
    const day = dayKey(message.sentAt);
    const time = Date.parse(message.sentAt);

    if (day !== currentDay) {
      currentDay = day;
      items.push({ kind: 'day', key: `day-${day}`, label: dayLabel(day) });
      group = null;
    }
    if (!unreadPlaced && !message.mine && message.read === false) {
      unreadPlaced = true;
      items.push({ kind: 'unread', key: 'unread' });
      group = null;
    }

    const entry: ThreadEntry = { ...message, parts: linkify(message.content), emojiOnly: isEmojiOnly(message.content) };
    const continues = group && group.mine === message.mine && group.messages[0].authorId === message.authorId
      && time - lastTime <= GROUP_GAP_MS;
    if (continues && group) {
      group.messages.push(entry);
      group.read = group.read && !!message.read;
    } else {
      group = {
        kind: 'group', key: `group-${message.id}`, mine: message.mine,
        authorName: message.authorName, avatarUrl: message.avatarUrl, initials: message.initials,
        messages: [entry], read: !!message.read,
      };
      items.push(group);
    }
    lastTime = time;
  }
  return items;
}

/** Course group chat messages as thread messages (shared by the course panel and the group chats page). */
export function groupMessagesToThread(
  messages: { id: number; senderId: number; senderFirstName: string; senderLastName: string; senderFileName?: string; content: string; sentAt: string }[],
  myId: number | undefined,
  avatarBase: string,
): ThreadMessage[] {
  return messages.map(m => ({
    id: m.id,
    mine: m.senderId === myId,
    authorId: m.senderId,
    authorName: `${m.senderFirstName ?? ''} ${m.senderLastName ?? ''}`.trim(),
    avatarUrl: m.senderFileName ? avatarBase + m.senderFileName : null,
    initials: ((m.senderFirstName?.[0] ?? '') + (m.senderLastName?.[0] ?? '')).toUpperCase(),
    content: m.content,
    sentAt: m.sentAt,
  }));
}
