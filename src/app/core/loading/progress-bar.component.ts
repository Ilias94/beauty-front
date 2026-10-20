import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { LoadingService } from './loading.service';

/**
 * Thin bar at the very top of the page while a route resolves or data loads.
 * It only appears after 250 ms, so fast responses never flash it.
 */
@Component({
  selector: 'app-progress-bar',
  template: `<div class="bar" [class.on]="visible()" role="progressbar" aria-hidden="true"><span></span></div>`,
  styleUrl: './progress-bar.component.sass'
})
export class ProgressBarComponent {
  private loading = inject(LoadingService);
  visible = signal(false);
  private timer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    inject(Router).events.pipe(takeUntilDestroyed(inject(DestroyRef))).subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loading.start();
      } else if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        this.loading.stop();
      }
    });

    effect(() => {
      if (this.loading.busy()) {
        this.timer ??= setTimeout(() => this.visible.set(true), 250);
      } else {
        if (this.timer) clearTimeout(this.timer);
        this.timer = null;
        this.visible.set(false);
      }
    });
  }
}
