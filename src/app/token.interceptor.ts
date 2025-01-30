import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngxs/store';
import { catchError, of, tap } from 'rxjs';

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
  return next(req).pipe(tap((response: HttpResponse<any>) =>{
    if (response.status >= 200 && response.status < 300) {
      if (req.method == 'POST' && !req.url.includes('login')) {
        matSnackBar.open("Saved successfully")
      } else if (req.method == 'PUT' || req.method == 'PATCH') {
        matSnackBar.open("Updated successfully")
      } else if (req.method == 'DELETE') {
        matSnackBar.open("Deleted successfully")
      }
    }
    }),catchError(error => {
    if (error.status > 399) {
      matSnackBar.open("Error accured", "x", { duration: 2000, verticalPosition: MatSnackBarVerticalPosition })
    }
    return of()
  }));
};
