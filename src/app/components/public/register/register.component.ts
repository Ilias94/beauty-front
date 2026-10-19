import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { Store } from '@ngxs/store';
import { RegisterAction } from '../../state/security.actions';
import { passwordRegex } from '../../../app.const';
import { UserDtoRequest } from '../../../../api/models';
import { environment } from '../../../../environments/enfironment';
import { TranslocoModule } from '@jsverse/transloco';
import { AuthAsideComponent } from '../auth-aside/auth-aside.component';

function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirm = group.get('confirmPassword');
  if (confirm && confirm.value && password !== confirm.value) {
    confirm.setErrors({ ...(confirm.errors ?? {}), mismatch: true });
  } else if (confirm?.hasError('mismatch')) {
    const { mismatch, ...rest } = confirm.errors!;
    confirm.setErrors(Object.keys(rest).length ? rest : null);
  }
  return null;
}

@Component({
    selector: 'app-register',
    imports: [
        ReactiveFormsModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatProgressSpinnerModule,
        RouterLink,
        TranslocoModule,
        AuthAsideComponent,
    ],
    templateUrl: './register.component.html',
    styleUrl: './register.component.sass'
})
export class RegisterComponent {
  private store = inject(Store);
  readonly googleUrl = environment.apiUrl + '/api/oauth2/authorization/google';

  form = new FormGroup({
    firstName: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(60)] }),
    lastName: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(60)] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6), Validators.pattern(passwordRegex)] }),
    confirmPassword: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  }, { validators: passwordsMatch });

  private password = toSignal(this.form.controls.password.valueChanges, { initialValue: '' });
  checks = computed(() => {
    const p = this.password();
    return [
      { key: 'password.minLength', ok: p.length >= 6 },
      { key: 'password.hasUpper', ok: /[A-Z]/.test(p) },
      { key: 'password.hasLower', ok: /[a-z]/.test(p) },
      { key: 'password.hasNumber', ok: /\d/.test(p) },
      { key: 'password.hasSpecial', ok: /[!@#$%^&*]/.test(p) },
    ];
  });

  isTeacher = signal(false);
  hidePassword = signal(true);
  submitting = signal(false);
  file: File | null = null;
  avatarPreview = signal<string | null>(null);

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => this.avatarPreview.set(e.target?.result as string);
      reader.readAsDataURL(this.file);
    }
  }

  removeAvatar(): void {
    this.avatarPreview.set(null);
    this.file = null;
  }

  loginWithGoogle(): void {
    window.location.href = this.googleUrl;
  }

  register(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    const userDto: UserDtoRequest = {
      email: value.email.trim(),
      firstName: value.firstName.trim(),
      lastName: value.lastName.trim(),
      password: value.password,
      confirmPassword: value.confirmPassword,
      isTeacher: this.isTeacher(),
    };
    this.submitting.set(true);
    // RegisterAction navigates to /login on success; errors are shown by the HTTP interceptor.
    this.store.dispatch(new RegisterAction(userDto, this.file)).subscribe({
      next: () => this.submitting.set(false),
      error: () => this.submitting.set(false),
    });
  }
}
