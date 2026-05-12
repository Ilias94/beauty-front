import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngxs/store';
import { TranslocoService } from '@jsverse/transloco';
import { catchError, of, tap } from 'rxjs';

// Requests that should never show a toast — the UI already provides visual feedback.
const SILENT_PATTERNS: RegExp[] = [
  /\/api\/v1\/messages$/,              // POST  — sending a chat message (bubble appears)
  /\/api\/v1\/messages\/\d+\/read/,    // PATCH — mark conversation as read (background op)
  /\/api\/v1\/ratings/,                // POST  — star rating (stars update visually)
  /\/api\/oauth2/,                     // OAuth redirects
];

const SUCCESS_CONFIG = { duration: 3000, panelClass: 'snack-success', verticalPosition: 'bottom' as const };
const ERROR_CONFIG   = { duration: 5000, panelClass: 'snack-error',   verticalPosition: 'bottom' as const };

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);
  const store    = inject(Store);
  const transloco = inject(TranslocoService);

  const token = store.selectSnapshot(state => state.security.token);
  if (token) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  const isSilent = SILENT_PATTERNS.some(p => p.test(req.url));

  return next(req).pipe(
    tap((response: HttpResponse<any>) => {
      if (isSilent || !(response instanceof HttpResponse)) return;
      const s = response.status;
      if (s >= 200 && s < 300) {
        if (req.method === 'POST' && !req.url.includes('login')) {
          snackBar.open(transloco.translate('http.savedSuccessfully'), '', SUCCESS_CONFIG);
        } else if (req.method === 'PUT' || req.method === 'PATCH') {
          snackBar.open(transloco.translate('http.updatedSuccessfully'), '', SUCCESS_CONFIG);
        } else if (req.method === 'DELETE') {
          snackBar.open(transloco.translate('http.deletedSuccessfully'), '', SUCCESS_CONFIG);
        }
      }
    }),
    catchError(error => {
      if (!isSilent && error.status >= 400) {
        const msg = error.error?.message
          ?? transloco.translate('http.errorOccurred');
        snackBar.open(msg, '✕', ERROR_CONFIG);
      }
      return of();
    })
  );
};
