import { Component, ElementRef, ViewChild, effect, input, model, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';

/**
 * The message input shared by every chat: grows with the text (up to a few lines), Enter sends,
 * Shift+Enter starts a new line, and the round send button lights up once there is something to send.
 * The text is two-way bound, so a parent can put it back if sending fails.
 */
@Component({
    selector: 'app-message-composer',
    imports: [MatIconModule, TranslocoModule],
    templateUrl: './message-composer.component.html',
    styleUrl: './message-composer.component.sass'
})
export class MessageComposerComponent {
  @ViewChild('box', { static: true }) private box!: ElementRef<HTMLTextAreaElement>;

  value = model('');
  placeholder = input('');
  disabled = input(false);
  maxLength = input(2000);
  send = output<string>();

  constructor() {
    // Also covers the parent clearing or restoring the text.
    effect(() => {
      this.value();
      requestAnimationFrame(() => this.resize());
    });
  }

  onInput(text: string): void {
    this.value.set(text);
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
      event.preventDefault();
      this.submit();
    }
  }

  submit(): void {
    const text = this.value().trim();
    if (!text || this.disabled()) return;
    this.send.emit(text);
    this.value.set('');
    this.box.nativeElement.focus();
  }

  focus(): void {
    this.box.nativeElement.focus();
  }

  private resize(): void {
    const el = this.box.nativeElement;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 132)}px`;
  }
}
