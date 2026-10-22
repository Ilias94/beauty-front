import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom, isDevMode, PLATFORM_ID } from '@angular/core';
import { provideRouter, withInMemoryScrolling, withViewTransitions } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

import { routes } from './app.routes';
import { provideClientHydration, withNoIncrementalHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NgxsModule } from '@ngxs/store';
import { SecurityState } from './components/state/security.state';
import { provideHttpClient, withInterceptors, HttpClient, withXhr } from '@angular/common/http';
import { AbstractControl } from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { tokenInterceptor } from './token.interceptor';
import { CourseState } from './components/state/course.state';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { UserState } from './components/state/user.state';
import { CategoryState } from './components/state/category.state';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { CommentState } from './components/state/comment.state';
import { RatingState } from './components/state/rating.state';
import { CookieService } from 'ngx-cookie-service';
import { AiState } from './components/state/ai.state';
import { PaymentState } from './components/state/payment.state';
import { FileState } from './components/state/file.state';
import { VideoState } from './components/state/video.state';
import { QuestionState } from './components/state/question.state';
import { NotificationState } from './components/state/notification.state';
import { TicketState } from './components/state/ticket.state';
import { ChatState } from './components/state/chat.state';
import { GroupChatState } from './components/state/group-chat.state';
import { provideTransloco, TranslocoLoader } from '@jsverse/transloco';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslatedPaginatorIntl } from './shared/paginator-intl';
import { inject, Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { LoginFromLocalStorageAction } from './components/state/security.actions';
import { filter, firstValueFrom, of, timeout, catchError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  private http = inject(HttpClient);
  getTranslation(lang: string) {
    return this.http.get<Record<string, unknown>>(`/assets/i18n/${lang}.json`);
  }
}




function initializeAuth(store: Store, platformId: Object) {
  return () => {
    if (!isPlatformBrowser(platformId)) return Promise.resolve();

    // Synchronously restore token from localStorage/cookie
    store.dispatch(new LoginFromLocalStorageAction());

    const token = store.selectSnapshot((s: any) => s.security.token);
    if (!token) return Promise.resolve();

    // Wait for the user object to be fetched (async API call), with a 5s safety timeout
    return firstValueFrom(
      store.select(SecurityState.getCurrentUser).pipe(
        filter(user => user !== null),
        timeout({ first: 5000, with: () => of(null) }),
        catchError(() => of(null))
      )
    );
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    CookieService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAuth,
      deps: [Store, PLATFORM_ID],
      multi: true,
    },
    // View transitions cross-fade pages (see styles.sass); new pages start at the top, #anchors scroll.
    provideRouter(routes,
      withViewTransitions({ skipInitialTransition: true }),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' })),
    provideClientHydration(withNoIncrementalHydration()),
    provideAnimationsAsync(),
    provideHttpClient(withXhr(), withInterceptors([tokenInterceptor])),
    provideTransloco({
      config: {
        availableLangs: ['pl', 'en'],
        defaultLang: 'pl',
        fallbackLang: 'pl',
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
    { provide: MatPaginatorIntl, useClass: TranslatedPaginatorIntl },
    importProvidersFrom(MatSnackBarModule,
      NgxsModule.forRoot([SecurityState,
        CourseState,
        UserState,
        CategoryState,
        CommentState,
        RatingState,
        AiState,
        PaymentState,
        FileState,
        VideoState,
        QuestionState,
        NotificationState,
        TicketState,
        ChatState,
        GroupChatState,
      ]),
      NgxsRouterPluginModule.forRoot(),
      MatSnackBarModule,
      FormlyModule.forRoot({
        validators: [{ name: 'passwordMatch', validation: fieldMatchValidator }],
        validationMessages: [
          { name: "required", message: (error: any, field: FormlyFieldConfig) => "This field is required" },
          { name: "minLength", message: (error: any, field: FormlyFieldConfig) => `Minimum  length is ${field.props.minLength}` }
        ]
      }),
      NgxsReduxDevtoolsPluginModule.forRoot()
    )
   
  ]
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

