import { Component, DestroyRef, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { Store } from '@ngxs/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { ChangePasswordAction, ChangeUserDataAction } from '../state/user.actions';
import { SecurityState } from '../state/security.state';
import { passwordRegex } from '../../app.const';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';

@Component({
    selector: 'app-account-form',
    imports: [
        FormlyModule,
        FormlyMaterialModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatIconModule,
        RouterModule,
        TranslocoModule,
    ],
    templateUrl: './account-form.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './account-form.component.sass'
})
export class AccountFormComponent implements OnInit {
  private store = inject(Store);
  private transloco = inject(TranslocoService);
  private destroyRef = inject(DestroyRef);

  currentUser = toSignal(this.store.select(SecurityState.getCurrentUser));

  readonly s3Base = 'https://picturesbeautyapplication.s3.eu-central-1.amazonaws.com/';

  userForm = new FormGroup({});
  userModel: Record<string, string> = {};
  userFields: FormlyFieldConfig[] = [];

  passwordForm = new FormGroup({});
  passwordFields: FormlyFieldConfig[] = [];

  constructor() {
    this.transloco.selectTranslation().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => {
      this.userFields = [
        {
          fieldGroupClassName: 'two-col',
          fieldGroup: [
            {
              key: 'firstName',
              type: 'input',
              className: 'col',
              props: { label: this.transloco.translate('auth.firstNameLabel'), appearance: 'outline', required: true },
            },
            {
              key: 'lastName',
              type: 'input',
              className: 'col',
              props: { label: this.transloco.translate('auth.lastNameLabel'), appearance: 'outline', required: true },
            },
          ],
        },
        {
          key: 'email',
          type: 'input',
          props: {
            label: this.transloco.translate('auth.emailLabel'),
            type: 'email',
            appearance: 'outline',
            required: true,
          },
        },
      ];

      this.passwordFields = [
        {
          key: 'oldPassword',
          type: 'input',
          props: {
            label: this.transloco.translate('account.currentPassword'),
            placeholder: this.transloco.translate('auth.passwordPlaceholder'),
            type: 'password',
            appearance: 'outline',
            required: true,
          },
        },
        {
          key: 'newPassword',
          type: 'input',
          props: {
            label: this.transloco.translate('account.newPassword'),
            placeholder: this.transloco.translate('auth.passwordPlaceholder'),
            type: 'password',
            appearance: 'outline',
            required: true,
            minLength: 6,
            pattern: passwordRegex,
          },
          validation: {
            messages: {
              pattern: () => this.transloco.translate('password.patternError'),
            },
          },
        },
        {
          key: 'confirmPassword',
          type: 'input',
          props: {
            label: this.transloco.translate('account.confirmNewPassword'),
            placeholder: this.transloco.translate('auth.passwordPlaceholder'),
            type: 'password',
            appearance: 'outline',
            required: true,
            minLength: 6,
          },
        },
      ];
    });
  }

  ngOnInit(): void {
    const u = this.currentUser();
    if (u) {
      this.userModel = {
        firstName: u.firstName ?? '',
        lastName: u.lastName ?? '',
        email: u.email ?? '',
      };
    }
  }

  initials(): string {
    const u = this.currentUser();
    return (u?.firstName?.[0] ?? '') + (u?.lastName?.[0] ?? '');
  }

  get newPasswordValue(): string {
    return this.passwordForm.get('newPassword')?.value ?? '';
  }

  get passwordChecks() {
    const p = this.newPasswordValue;
    return {
      minLength: p.length >= 6,
      hasLower: /[a-z]/.test(p),
      hasUpper: /[A-Z]/.test(p),
      hasNumber: /\d/.test(p),
      hasSpecial: /[!@#$%^&*]/.test(p),
    };
  }

  get passwordStrength(): number {
    return Object.values(this.passwordChecks).filter(Boolean).length;
  }

  get strengthLabel(): string {
    const s = this.passwordStrength;
    if (s <= 1) return this.transloco.translate('password.veryWeak');
    if (s === 2) return this.transloco.translate('password.weak');
    if (s === 3) return this.transloco.translate('password.fair');
    if (s === 4) return this.transloco.translate('password.good');
    return this.transloco.translate('password.strong');
  }

  get strengthClass(): string {
    const s = this.passwordStrength;
    if (s <= 1) return 'strength-1';
    if (s === 2) return 'strength-2';
    if (s === 3) return 'strength-3';
    if (s === 4) return 'strength-4';
    return 'strength-5';
  }

  saveUserData(): void {
    const u = this.currentUser();
    if (!u?.id) return;
    this.store.dispatch(new ChangeUserDataAction({
      firstName: this.userForm.get('firstName')?.value,
      lastName: this.userForm.get('lastName')?.value,
      email: this.userForm.get('email')?.value,
      password: '',
    }, u.id));
  }

  changePassword(): void {
    this.store.dispatch(new ChangePasswordAction({
      oldPassword: this.passwordForm.get('oldPassword')?.value,
      newPassword: this.passwordForm.get('newPassword')?.value,
      confirmNewPassword: this.passwordForm.get('confirmPassword')?.value,
    }));
  }
}
