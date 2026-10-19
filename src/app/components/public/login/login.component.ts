import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Store } from '@ngxs/store';
import { LoginAction } from '../../state/security.actions';
import { environment } from '../../../../environments/enfironment';
import { TranslocoModule } from '@jsverse/transloco';
import { AuthAsideComponent } from '../auth-aside/auth-aside.component';

@Component({
    selector: 'app-login',
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
    templateUrl: './login.component.html',
    styleUrl: './login.component.sass'
})
export class LoginComponent {
  private store = inject(Store);
  private router = inject(Router);
  private returnUrl: string = inject(ActivatedRoute).snapshot.queryParamMap.get('returnUrl') ?? '/courses';

  readonly googleUrl = environment.apiUrl + '/api/oauth2/authorization/google';

  form = new FormGroup({
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  hidePassword = signal(true);
  submitting = signal(false);
  error = signal(false);

  login(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.error.set(false);
    this.submitting.set(true);
    const { email, password } = this.form.getRawValue();
    this.store.dispatch(new LoginAction(email.trim(), password)).subscribe({
      next: () => {
        this.submitting.set(false);
        // Only follow local paths, never an absolute URL from the query string.
        const target = this.returnUrl.startsWith('/') && !this.returnUrl.startsWith('//') ? this.returnUrl : '/courses';
        this.router.navigateByUrl(target);
      },
      error: () => {
        this.submitting.set(false);
        this.error.set(true);
      },
    });
  }

  loginWithGoogle(): void {
    window.location.href = this.googleUrl;
  }
}
