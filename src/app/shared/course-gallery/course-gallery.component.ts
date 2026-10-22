import { Component, ElementRef, HostListener, ViewChild, computed, effect, inject, input, output, signal, DOCUMENT } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';
import { CategoryVisual } from '../category-visual';

/**
 * The photos on a course page: a mosaic (one large photo, up to four beside it) that opens a
 * full-screen viewer. Without photos it shows the category's tint and icon, and the course's
 * creator gets a button to add some.
 */
@Component({
  selector: 'app-course-gallery',
  imports: [MatIconModule, TranslocoModule],
  templateUrl: './course-gallery.component.html',
  styleUrl: './course-gallery.component.sass'
})
export class CourseGalleryComponent {
  photos = input.required<string[]>();
  title = input('');
  visual = input.required<CategoryVisual>();
  canEdit = input(false);
  edit = output<void>();

  private body = inject(DOCUMENT).body;
  @ViewChild('closeButton') closeButton?: ElementRef<HTMLButtonElement>;

  /** Index of the photo open in the viewer, null when it is closed. */
  open = signal<number | null>(null);
  mosaic = computed(() => this.photos().slice(0, 5));
  extra = computed(() => this.photos().length - this.mosaic().length);

  private swipeStart: number | null = null;

  constructor() {
    // The page behind the viewer doesn't scroll, and focus starts on the close button.
    effect(() => {
      const isOpen = this.open() !== null;
      this.body.style.overflow = isOpen ? 'hidden' : '';
      if (isOpen) queueMicrotask(() => this.closeButton?.nativeElement.focus());
    });
  }

  show(index: number): void {
    this.open.set(index);
  }

  close(): void {
    this.open.set(null);
  }

  step(by: number): void {
    const i = this.open();
    if (i === null) return;
    const n = this.photos().length;
    this.open.set((i + by + n) % n);
  }

  @HostListener('document:keydown', ['$event'])
  onKey(event: KeyboardEvent): void {
    if (this.open() === null) return;
    if (event.key === 'Escape') this.close();
    else if (event.key === 'ArrowRight') this.step(1);
    else if (event.key === 'ArrowLeft') this.step(-1);
  }

  onPointerDown(event: PointerEvent): void {
    this.swipeStart = event.clientX;
  }

  /** A horizontal swipe of 50px or more turns the page. */
  onPointerUp(event: PointerEvent): void {
    if (this.swipeStart === null) return;
    const dx = event.clientX - this.swipeStart;
    this.swipeStart = null;
    if (Math.abs(dx) > 50) this.step(dx < 0 ? 1 : -1);
  }
}
