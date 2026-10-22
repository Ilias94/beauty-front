import { Component, PLATFORM_ID, computed, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslocoModule } from '@jsverse/transloco';
import { ConnectControllerService } from '../../../api/services';
import { ConnectStatusDtoResponse } from '../../../api/models';

type Step = 'loading' | 'notConnected' | 'unfinished' | 'inReview' | 'ready' | 'error';

/**
 * An instructor's payouts: connects their Stripe account, which course payments are paid out to,
 * shows where onboarding stands and opens Stripe's dashboard for balance, payouts and bank details.
 */
@Component({
    selector: 'app-payouts',
    imports: [MatButtonModule, MatIconModule, MatProgressSpinnerModule, TranslocoModule],
    templateUrl: './payouts.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './payouts.component.sass'
})
export class PayoutsComponent {
  private connectController = inject(ConnectControllerService);

  private status = signal<ConnectStatusDtoResponse | null>(null);
  private failed = signal(false);
  redirecting = signal(false);

  step = computed<Step>(() => {
    const s = this.status();
    if (this.failed()) return 'error';
    if (!s) return 'loading';
    if (!s.accountCreated) return 'notConnected';
    if (!s.detailsSubmitted) return 'unfinished';
    if (!s.chargesEnabled || !s.payoutsEnabled) return 'inReview';
    return 'ready';
  });

  constructor() {
    // The token lives in the browser, so the server-side render only shows the spinner.
    if (!isPlatformBrowser(inject(PLATFORM_ID))) return;
    // Stripe sends the instructor here when an onboarding link has expired: hand out a fresh one.
    if (inject(ActivatedRoute).snapshot.queryParamMap.get('onboarding') === 'expired') {
      this.continueOnboarding();
      return;
    }
    this.connectController.getStripeConnectStatus().subscribe({
      next: status => this.status.set(status),
      error: () => this.failed.set(true)
    });
  }

  continueOnboarding() {
    this.redirecting.set(true);
    this.connectController.startStripeOnboarding().subscribe({
      next: link => window.location.href = link.url!,
      error: () => { this.redirecting.set(false); this.failed.set(true); }
    });
  }

  openDashboard() {
    // Opened before the request so the browser doesn't treat it as an unrequested pop-up.
    const tab = window.open('', '_blank');
    this.connectController.createStripeDashboardLink().subscribe({
      next: link => tab ? tab.location.href = link.url! : window.location.href = link.url!,
      error: () => { tab?.close(); this.failed.set(true); }
    });
  }
}
