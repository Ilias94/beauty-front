import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngxs/store';
import { TranslocoService } from '@jsverse/transloco';
import { catchError, finalize, tap, throwError } from 'rxjs';
import { LogoutAction } from './components/state/security.actions';
import { LoadingService } from './core/loading/loading.service';

// Requests that should never show a toast — the UI already provides visual feedback.
const SILENT_PATTERNS: RegExp[] = [
  /\/api\/v1\/messages$/,              // POST  — sending a chat message (bubble appears)
  /\/api\/v1\/messages\/\d+\/read/,    // PATCH — mark conversation as read (background op)
  /\/courses\/\d+\/messages$/,         // POST  — sending a group chat message (bubble appears)
  /\/api\/v1\/rating\b/,               // POST  — star rating (stars and the summary update visually)
  /\/api\/v1\/assistant/,              // POST  — assistant answers and errors show in the chat panel
  /\/api\/v1\/login/,                  // POST  — the login form shows its own error
  /\/api\/oauth2/,                     // OAuth redirects
];

const SUCCESS_CONFIG = { duration: 3000, panelClass: 'snack-success', verticalPosition: 'bottom' as const, horizontalPosition: 'start' as const };
const ERROR_CONFIG   = { duration: 5000, panelClass: 'snack-error',   verticalPosition: 'bottom' as const, horizontalPosition: 'start' as const };

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);
  const store    = inject(Store);
  const transloco = inject(TranslocoService);

  const token = store.selectSnapshot(state => state.security.token);
  if (token) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  const isSilent = SILENT_PATTERNS.some(p => p.test(req.url));
  // Background requests (chat, ratings, assistant) have their own feedback; don't run the top bar for them.
  const loading = inject(LoadingService);
  if (!isSilent) loading.start();

  return next(req).pipe(
    finalize(() => { if (!isSilent) loading.stop(); }),
    tap((response: HttpResponse<any>) => {
      if (isSilent || !(response instanceof HttpResponse)) return;
      const s = response.status;
      if (s >= 200 && s < 300) {
        if (req.method === 'POST') {
          snackBar.open(transloco.translate('http.savedSuccessfully'), '', SUCCESS_CONFIG);
        } else if (req.method === 'PUT' || req.method === 'PATCH') {
          snackBar.open(transloco.translate('http.updatedSuccessfully'), '', SUCCESS_CONFIG);
        } else if (req.method === 'DELETE') {
          snackBar.open(transloco.translate('http.deletedSuccessfully'), '', SUCCESS_CONFIG);
        }
      }
    }),
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && token) {
        // The token expired or was signed with a key the backend no longer trusts.
        snackBar.open(transloco.translate('http.sessionExpired'), '✕', ERROR_CONFIG);
        // Stay on the page: public pages keep working, protected ones are handled by authGuard.
        store.dispatch(new LogoutAction(false));
      } else if (!isSilent && error.status >= 400) {
        const msg = error.error?.message ?? transloco.translate('http.errorOccurred');
        snackBar.open(msg, '✕', ERROR_CONFIG);
      } else if (!isSilent && error.status === 0) {
        snackBar.open(transloco.translate('http.offline'), '✕', ERROR_CONFIG);
      }
      // Rethrow so callers can react (stop spinners, show inline errors).
      return throwError(() => error);
    })
  );
};
