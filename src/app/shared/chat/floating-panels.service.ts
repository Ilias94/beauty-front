import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngxs/store';
import { CloseChatAction, OpenChatAction } from '../../components/state/chat.actions';

export type FloatingPanel = 'assistant' | 'chat' | 'group';

/**
 * The bottom-right corner holds one button (FabDockComponent) and one open panel at a time:
 * the AI assistant, private messages or, on a course page, that course's group chat.
 * Private messages keep their open state in the NGXS chat state; the others live here.
 */
@Injectable({ providedIn: 'root' })
export class FloatingPanelsService {
  private store = inject(Store);

  readonly chatOpen = toSignal(this.store.select(state => state.chat.open), { initialValue: false });
  readonly assistantOpen = signal(false);
  readonly groupChatOpen = signal(false);
  /** Set by the course page while its group chat is available (owner or participant). */
  readonly groupChat = signal<{ courseId: number; title: string } | null>(null);

  readonly anyOpen = computed(() => this.chatOpen() || this.assistantOpen() || this.groupChatOpen());

  constructor() {
    // The chat also opens from elsewhere ("Message the instructor"): close the other panels then.
    effect(() => {
      if (this.chatOpen()) {
        this.assistantOpen.set(false);
        this.groupChatOpen.set(false);
      }
    });
  }

  open(panel: FloatingPanel): void {
    this.assistantOpen.set(panel === 'assistant');
    this.groupChatOpen.set(panel === 'group');
    if (panel === 'chat') {
      this.store.dispatch(new OpenChatAction());
    } else if (this.chatOpen()) {
      this.store.dispatch(new CloseChatAction());
    }
  }

  closeAll(): void {
    this.assistantOpen.set(false);
    this.groupChatOpen.set(false);
    if (this.chatOpen()) this.store.dispatch(new CloseChatAction());
  }

  private groupChatOwner: object | null = null;

  /**
   * The owner is the registering component: when the course page re-renders, the new instance
   * registers before the old one is destroyed, so only the current owner may unregister.
   */
  registerGroupChat(owner: object, courseId: number, title: string): void {
    this.groupChatOwner = owner;
    this.groupChat.set({ courseId, title });
  }

  unregisterGroupChat(owner: object): void {
    if (this.groupChatOwner === owner) {
      this.groupChatOwner = null;
      this.groupChat.set(null);
      this.groupChatOpen.set(false);
    }
  }
}
