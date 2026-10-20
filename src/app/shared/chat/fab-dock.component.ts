import { Component, ElementRef, HostListener, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngxs/store';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';
import { ChatState } from '../../components/state/chat.state';
import { SecurityState } from '../../components/state/security.state';
import { FloatingPanel, FloatingPanelsService } from './floating-panels.service';

/**
 * One round button in the corner instead of a stack of three. It opens a short menu
 * (AI assistant, messages, and the course group chat on a course page); while a panel is
 * open it closes that panel. The badge shows unread private messages.
 */
@Component({
    selector: 'app-fab-dock',
    imports: [MatIconModule, TranslocoModule],
    templateUrl: './fab-dock.component.html',
    styleUrl: './fab-dock.component.sass'
})
export class FabDockComponent {
  panels = inject(FloatingPanelsService);
  private store = inject(Store);
  private host = inject(ElementRef<HTMLElement>);

  currentUser = toSignal(this.store.select(SecurityState.getCurrentUser));
  unread = toSignal(this.store.select(ChatState.unreadTotal), { initialValue: 0 });
  expanded = signal(false);

  main(): void {
    if (this.panels.anyOpen()) {
      this.panels.closeAll();
    } else {
      this.expanded.update(open => !open);
    }
  }

  pick(panel: FloatingPanel): void {
    this.expanded.set(false);
    this.panels.open(panel);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.expanded.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.expanded() && !this.host.nativeElement.contains(event.target as Node)) {
      this.expanded.set(false);
    }
  }
}
