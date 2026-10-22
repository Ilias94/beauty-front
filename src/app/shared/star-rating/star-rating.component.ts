import { Component, computed, input, output, signal, ChangeDetectionStrategy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';

/**
 * Five-star rating. Read-only it shows fractional values (4.3 fills 4.3 stars);
 * interactive it is a row of buttons with a hover preview and keyboard support.
 */
@Component({
  selector: 'app-star-rating',
  imports: [MatIconModule, TranslocoModule],
  template: `
    @if (readonly()) {
      <span class="stars" [class]="'size-' + size()" role="img"
        [attr.aria-label]="'rating.readonlyLabel' | transloco: { value: value() ?? 0 }">
        <span class="star-row base">@for (s of five; track $index) {<mat-icon>star</mat-icon>}</span>
        <span class="star-row fill" [style.width.%]="fillPercent()">@for (s of five; track $index) {<mat-icon>star</mat-icon>}</span>
      </span>
    } @else {
      <span class="stars interactive" [class]="'size-' + size()" role="radiogroup"
        [attr.aria-label]="label() || ('rating.interactiveLabel' | transloco)" (mouseleave)="hover.set(0)">
        @for (s of five; track $index; let i = $index) {
          <button type="button" role="radio" [attr.aria-checked]="(value() ?? 0) === i + 1"
            [attr.aria-label]="'rating.starLabel' | transloco: { value: i + 1 }"
            [class.on]="(hover() || value() || 0) >= i + 1"
            (mouseenter)="hover.set(i + 1)" (focus)="hover.set(i + 1)" (blur)="hover.set(0)"
            (click)="rate.emit(i + 1)">
            <mat-icon>star</mat-icon>
          </button>
        }
      </span>
    }
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './star-rating.component.sass'
})
export class StarRatingComponent {
  value = input<number | null | undefined>(0);
  readonly = input(true);
  size = input<'sm' | 'md' | 'lg'>('md');
  label = input<string>('');
  rate = output<number>();

  hover = signal(0);
  readonly five = [0, 1, 2, 3, 4];
  fillPercent = computed(() => Math.max(0, Math.min(100, ((this.value() ?? 0) / 5) * 100)));
}
