import { Component, DestroyRef, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, EMPTY, switchMap, takeWhile, timer } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';
import { PaymentControllerService } from '../../../api/services';

type PaymentStatus = 'SUCCESS' | 'FAILED' | 'IN_PROGRESS' | 'CANCELLED';

// Stripe's webhook usually lands within seconds of the redirect; BLIK and Przelewy24 can take longer.
const POLL_INTERVAL_MS = 2000;
const POLL_ATTEMPTS = 30;

/**
 * Landing page after Stripe Checkout: tells the user what happened and what to do next.
 * The outcome comes from the backend, which learns it from Stripe's webhook, never from the URL.
 */
@Component({
    selector: 'app-payment-status',
    imports: [MatButtonModule, MatIconModule, RouterLink, TranslocoModule],
    templateUrl: './payment-status.component.html',
    styleUrl: './payment-status.component.sass'
})
export class PaymentStatusComponent {
  private params = inject(ActivatedRoute).snapshot.queryParamMap;
  private paymentController = inject(PaymentControllerService);

  status = signal<PaymentStatus>(this.params.get('cancelled') === 'true' ? 'CANCELLED' : 'IN_PROGRESS');

  view = computed(() => {
    switch (this.status()) {
      case 'SUCCESS': return { icon: 'check', tone: 'success', key: 'success' };
      case 'FAILED': return { icon: 'close', tone: 'danger', key: 'failed' };
      case 'CANCELLED': return { icon: 'close', tone: 'danger', key: 'cancelled' };
      default: return { icon: 'schedule', tone: 'pending', key: 'pending' };
    }
  });

  constructor() {
    const orderId = this.params.get('orderId');
    // The token lives in the browser, so the server-side render only shows the pending state.
    if (!orderId || this.status() === 'CANCELLED' || !isPlatformBrowser(inject(PLATFORM_ID))) {
      return;
    }
    timer(0, POLL_INTERVAL_MS).pipe(
      switchMap(() => this.paymentController.getPaymentStatus({ orderId })),
      takeWhile((payment, attempt) => payment.status === 'IN_PROGRESS' && attempt < POLL_ATTEMPTS - 1, true),
      catchError(() => EMPTY),
      takeUntilDestroyed(inject(DestroyRef))
    ).subscribe(payment => this.status.set(payment.status ?? 'IN_PROGRESS'));
  }
}
