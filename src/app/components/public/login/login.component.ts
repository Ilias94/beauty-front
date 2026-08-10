import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { RouterLink } from '@angular/router';
import { Store } from '@ngxs/store';
import { LoginAction } from '../../state/security.actions';
import { environment } from '../../../../environments/enfironment';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';

@Component({
    selector: 'app-login',
    imports: [
        FormlyModule,
        FormlyMaterialModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatIconModule,
        MatDividerModule,
        RouterLink,
        TranslocoModule,
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.sass'
})
export class LoginComponent {

  readonly googleUrl = environment.apiUrl + '/api/oauth2/authorization/google';
  private transloco = inject(TranslocoService);
  private destroyRef = inject(DestroyRef);

  form = new FormGroup({});
  fields: FormlyFieldConfig[] = [];

  constructor(private store: Store) {
    this.transloco.selectTranslation().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => {
      this.fields = [
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
          key: 'password',
          type: 'input',
          props: {
            label: this.transloco.translate('auth.passwordLabel'),
            placeholder: this.transloco.translate('auth.passwordPlaceholder'),
            type: 'password',
            appearance: 'outline',
            required: true,
          }
        }
      ];
    });
  }

  login(): void {
    this.store.dispatch(new LoginAction(
      this.form.get('email')?.value,
      this.form.get('password')?.value
    ));
  }

  loginWithGoogle(): void {
    window.location.href = this.googleUrl;
  }
}
