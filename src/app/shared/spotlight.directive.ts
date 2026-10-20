import { Directive, ElementRef, NgZone, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Soft glow that follows the mouse over a card or tile (styles: `.spotlight` in styles.sass).
 * Only writes two CSS variables, outside Angular, so moving the mouse never runs change detection.
 */
@Directive({
  selector: '[appSpotlight]',
  host: { class: 'spotlight' },
})
export class SpotlightDirective implements OnDestroy {
  private el: HTMLElement = inject(ElementRef).nativeElement;
  private frame = 0;

  private onMove = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse') return;
    cancelAnimationFrame(this.frame);
    this.frame = requestAnimationFrame(() => {
      const rect = this.el.getBoundingClientRect();
      this.el.style.setProperty('--mx', `${event.clientX - rect.left}px`);
      this.el.style.setProperty('--my', `${event.clientY - rect.top}px`);
    });
  };

  constructor() {
    if (!isPlatformBrowser(inject(PLATFORM_ID))) return;
    inject(NgZone).runOutsideAngular(() => this.el.addEventListener('pointermove', this.onMove, { passive: true }));
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.frame);
    this.el.removeEventListener('pointermove', this.onMove);
  }
}
