import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatRippleModule } from '@angular/material/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Store } from '@ngxs/store';
import { RegisterAction } from '../../state/security.actions';
import { passwordRegex } from '../../../app.const';
import { UserDtoRequest } from '../../../../api/models';
import { environment } from '../../../../environments/enfironment';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';

@Component({
    selector: 'app-register',
    imports: [
        CommonModule,
        FormlyModule,
        FormlyMaterialModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatIconModule,
        MatDividerModule,
        MatRippleModule,
        RouterLink,
        TranslocoModule,
    ],
    templateUrl: './register.component.html',
    styleUrl: './register.component.sass'
})
export class RegisterComponent {

  readonly googleUrl = environment.apiUrl + '/api/oauth2/authorization/google';
  private transloco = inject(TranslocoService);
  private store = inject(Store);
  private destroyRef = inject(DestroyRef);

  file: File | null = null;
  avatarPreview: string | null = null;
  isTeacher = false;

  form = new FormGroup({});
  fields: FormlyFieldConfig[] = [];

  constructor() {
    this.transloco.selectTranslation().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => {
      this.fields = [
        {
          fieldGroupClassName: 'two-col',
          fieldGroup: [
            {
              key: 'firstName',
              type: 'input',
              className: 'col',
              props: {
                label: this.transloco.translate('auth.firstNameLabel'),
                placeholder: this.transloco.translate('auth.firstNamePlaceholder'),
                appearance: 'outline',
                required: true,
              }
            },
            {
              key: 'lastName',
              type: 'input',
              className: 'col',
              props: {
                label: this.transloco.translate('auth.lastNameLabel'),
                placeholder: this.transloco.translate('auth.lastNamePlaceholder'),
                appearance: 'outline',
                required: true,
              }
            },
          ]
        },
        {
          key: 'email',
          type: 'input',
          props: {
            label: this.transloco.translate('auth.emailLabel'),
            placeholder: this.transloco.translate('auth.emailPlaceholder'),
            type: 'email',
            appearance: 'outline',
            required: true,
          }
        },
        {
          validators: {
            validation: [{ name: 'passwordMatch', options: { errorPath: 'confirmPassword' } }],
          },
          fieldGroup: [
            {
              key: 'password',
              type: 'input',
              props: {
                label: this.transloco.translate('auth.passwordLabel'),
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
                }
              }
            },
            {
              key: 'confirmPassword',
              type: 'input',
              props: {
                label: this.transloco.translate('auth.confirmPasswordLabel'),
                placeholder: this.transloco.translate('auth.passwordPlaceholder'),
                type: 'password',
                appearance: 'outline',
                required: true,
                minLength: 6,
              },
            },
          ]
        },
      ];
    });
  }

  get passwordValue(): string {
    return this.form.get('password')?.value ?? '';
  }

  get passwordChecks() {
    const p = this.passwordValue;
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

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.avatarPreview = e.target?.result as string;
      };
      reader.readAsDataURL(this.file);
    }
  }

  removeAvatar(): void {
    this.avatarPreview = null;
    this.file = null;
  }

  selectAccountType(teacher: boolean): void {
    this.isTeacher = teacher;
  }

  loginWithGoogle(): void {
    window.location.href = this.googleUrl;
  }

  register(): void {
    const userDto: UserDtoRequest = {
      email: this.form.get('email')?.value,
      firstName: this.form.get('firstName')?.value,
      lastName: this.form.get('lastName')?.value,
      password: this.form.get('password')?.value,
      confirmPassword: this.form.get('confirmPassword')?.value,
      isTeacher: this.isTeacher,
    };
    this.store.dispatch(new RegisterAction(userDto, this.file));
  }
}
