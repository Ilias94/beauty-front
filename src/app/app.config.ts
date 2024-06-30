import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NgxsModule } from '@ngxs/store';
import { SecurityState } from './components/state/security.state';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { AbstractControl } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { tokenInterceptor } from './token.interceptor';
import { CourseState } from './components/state/course.state';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { TimePickerComponent } from './components/common/time-picker/time-picker.component';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([tokenInterceptor])),
    importProvidersFrom(MatSnackBarModule,NgxsRouterPluginModule.forRoot(),NgxsModule.forRoot([SecurityState, CourseState]), MatSnackBarModule,
      FormlyModule.forRoot({
        validators: [{ name: 'passwordMatch', validation: fieldMatchValidator }],
        types: [{name: 'time-picker', component: TimePickerComponent,
          }]
      }))]
};

export function fieldMatchValidator(control: AbstractControl) {
  const { password, confirmPassword } = control.value;

  // avoid displaying the message error when values are empty
  if (!confirmPassword || !password) {
    return null;
  }

  if (confirmPassword === password) {
    return null;
  }

  return { fieldMatch: { message: 'Password Not Matching' } };
}