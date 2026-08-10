import { Component, DestroyRef, inject, Signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { RouterModule } from '@angular/router';
import { Store } from '@ngxs/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { UserDtoResponse } from '../../../api/models';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';

interface NavCard {
  icon: string;
  title: string;
  desc: string;
  route: string;
  gradient: string;
  teacherOnly?: boolean;
}

@Component({
    selector: 'app-my-account',
    imports: [MatCardModule, MatButtonModule, MatIconModule, MatRippleModule, RouterModule, TranslocoModule],
    templateUrl: './my-account.component.html',
    styleUrl: './my-account.component.sass'
})
export class MyAccountComponent {
  private store = inject(Store);
  private transloco = inject(TranslocoService);
  private destroyRef = inject(DestroyRef);

  currentUser: Signal<UserDtoResponse> = toSignal(this.store.select(state => state.security.currentUser));

  readonly s3Base = 'https://picturesbeautyapplication.s3.eu-central-1.amazonaws.com/';

  navCards: NavCard[] = [];

  constructor() {
    this.transloco.selectTranslation().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => {
      this.navCards = [
        {
          icon: 'manage_accounts',
          title: this.transloco.translate('account.accountSettings'),
          desc: this.transloco.translate('account.accountSettingsDesc'),
          route: '/account',
          gradient: 'linear-gradient(135deg, #C2185B, #E91E63)',
        },
        {
          icon: 'chat_bubble',
          title: this.transloco.translate('account.myComments'),
          desc: this.transloco.translate('account.myCommentsDesc'),
          route: '/my-comments',
          gradient: 'linear-gradient(135deg, #E65100, #FFA726)',
        },
      ];
    });
  }

  getInitials(): string {
    const u = this.currentUser();
    if (!u) return '?';
    return (u.firstName?.[0] ?? '') + (u.lastName?.[0] ?? '');
  }

  getRoleLabel(): string {
    const u = this.currentUser();
    if (!u) return '';
    return u.teacher
      ? this.transloco.translate('account.teacher')
      : this.transloco.translate('account.student');
  }
}
