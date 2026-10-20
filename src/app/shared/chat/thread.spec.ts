import { ThreadItem, ThreadMessage, buildThread, isEmojiOnly, linkify } from './thread';

const msg = (id: number, authorId: number, sentAt: string, extra: Partial<ThreadMessage> = {}): ThreadMessage =>
  ({ id, authorId, mine: authorId === 1, content: `m${id}`, sentAt, ...extra });

const kinds = (items: ThreadItem[]) => items.map(i => i.kind === 'group' ? `group:${i.messages.map(m => m.id).join(',')}` : i.kind);

describe('buildThread', () => {
  const label = (day: string) => day;

  it('groups consecutive messages from one person within five minutes', () => {
    const items = buildThread([
      msg(1, 2, '2026-10-20T10:00:00'),
      msg(2, 2, '2026-10-20T10:03:00'),
      msg(3, 2, '2026-10-20T10:09:00'), // 6 minutes later: new group
      msg(4, 1, '2026-10-20T10:10:00'),
    ], label, false);

    expect(kinds(items)).toEqual(['day', 'group:1,2', 'group:3', 'group:4']);
  });

  it('starts a new day with a separator and a new group', () => {
    const items = buildThread([
      msg(1, 2, '2026-10-19T23:58:00'),
      msg(2, 2, '2026-10-20T00:01:00'),
    ], label, false);

    expect(kinds(items)).toEqual(['day', 'group:1', 'day', 'group:2']);
    expect((items[2] as { label: string }).label).toBe('2026-10-20');
  });

  it('puts the "new messages" divider before the first unread message from the other person only', () => {
    const items = buildThread([
      msg(1, 1, '2026-10-20T10:00:00', { read: false }), // mine and unread by them: no divider
      msg(2, 2, '2026-10-20T10:01:00', { read: true }),
      msg(3, 2, '2026-10-20T10:02:00', { read: false }),
      msg(4, 2, '2026-10-20T10:03:00', { read: false }),
    ], label, true);

    expect(kinds(items)).toEqual(['day', 'group:1', 'group:2', 'unread', 'group:3,4']);
  });

  it('marks a group read only when every message in it was read', () => {
    const items = buildThread([
      msg(1, 1, '2026-10-20T10:00:00', { read: true }),
      msg(2, 1, '2026-10-20T10:01:00', { read: false }),
    ], label, true);

    expect((items[1] as { read: boolean }).read).toBeFalse();
  });
});

describe('linkify', () => {
  it('splits links out of text without the trailing punctuation', () => {
    expect(linkify('Zobacz https://bellademy.pl/kursy, a potem pisz.')).toEqual([
      { text: 'Zobacz ' },
      { text: 'https://bellademy.pl/kursy', href: 'https://bellademy.pl/kursy' },
      { text: ', a potem pisz.' },
    ]);
  });

  it('leaves text without links as one part', () => {
    expect(linkify('Dzień dobry')).toEqual([{ text: 'Dzień dobry' }]);
  });
});

describe('isEmojiOnly', () => {
  it('recognises up to three emoji', () => {
    expect(isEmojiOnly('🙂')).toBeTrue();
    expect(isEmojiOnly('👍🏻 ❤️')).toBeTrue();
    expect(isEmojiOnly('🙂🙂🙂🙂')).toBeFalse();
    expect(isEmojiOnly('ok 🙂')).toBeFalse();
  });
});
