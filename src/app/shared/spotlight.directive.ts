import { Directive, ElementRef, NgZone, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * A light that follows the mouse along a card's border (styles: `.spotlight` in styles.sass).
 * It writes CSS variables, outside Angular, so moving the mouse never runs change detection:
 * --mx/--my are the pointer position in px, --px/--py the same from -1 to 1 around the centre
 * (back to 0 when the pointer leaves), for components that tilt or shift their content with it.
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
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      this.el.style.setProperty('--mx', `${x}px`);
      this.el.style.setProperty('--my', `${y}px`);
      this.el.style.setProperty('--px', (x / rect.width * 2 - 1).toFixed(3));
      this.el.style.setProperty('--py', (y / rect.height * 2 - 1).toFixed(3));
    });
  };

  private onLeave = () => {
    cancelAnimationFrame(this.frame);
    this.el.style.setProperty('--px', '0');
    this.el.style.setProperty('--py', '0');
  };

  constructor() {
    if (!isPlatformBrowser(inject(PLATFORM_ID))) return;
    inject(NgZone).runOutsideAngular(() => {
      this.el.addEventListener('pointermove', this.onMove, { passive: true });
      this.el.addEventListener('pointerleave', this.onLeave, { passive: true });
    });
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.frame);
    this.el.removeEventListener('pointermove', this.onMove);
    this.el.removeEventListener('pointerleave', this.onLeave);
  }
}
