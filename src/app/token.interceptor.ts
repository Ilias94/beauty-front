import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngxs/store';
import { catchError, of } from 'rxjs';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const matSnackBar = inject(MatSnackBar)
  const store = inject(Store)
  const token = store.selectSnapshot(state => state.security.token)
  const MatSnackBarVerticalPosition = 'bottom';
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    })
  }
  return next(req).pipe(catchError(error => {
    if (error.status > 399) {
      matSnackBar.open("Error accured", "x", { duration: 2000, verticalPosition: MatSnackBarVerticalPosition })
    }
    return of()
  }));
};
