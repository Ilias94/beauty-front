import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';

type PaymentStatus = 'SUCCESS' | 'FAILED' | 'IN_PROGRESS';

/** Landing page after Stripe Checkout: tells the user what happened and what to do next. */
@Component({
    selector: 'app-payment-status',
    imports: [MatButtonModule, MatIconModule, RouterLink, TranslocoModule],
    templateUrl: './payment-status.component.html',
    styleUrl: './payment-status.component.sass'
})
export class PaymentStatusComponent {
  status = toSignal(inject(ActivatedRoute).queryParamMap.pipe(
    map(params => (params.get('status') ?? 'IN_PROGRESS') as PaymentStatus)));

  view = computed(() => {
    switch (this.status()) {
      case 'SUCCESS': return { icon: 'check', tone: 'success', key: 'success' };
      case 'FAILED': return { icon: 'close', tone: 'danger', key: 'failed' };
      default: return { icon: 'schedule', tone: 'pending', key: 'pending' };
    }
  });
}
