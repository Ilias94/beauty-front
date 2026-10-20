import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { filter, map, of, take, timeout } from 'rxjs';
import { SecurityState } from './components/state/security.state';

/**
 * Lets logged-in users through, optionally only with one of `data.roles`.
 * Right after login or a page reload the token is known before the current user is fetched,
 * so the guard waits for the user instead of bouncing to /forbidden.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);
  const roles: string[] | undefined = route.data['roles'];
  const toLogin = () => router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });

  if (!store.selectSnapshot(s => s.security.token)) {
    return toLogin();
  }

  return store.select(SecurityState.getCurrentUser).pipe(
    filter(user => !!user),
    take(1),
    timeout({ first: 10000, with: () => of(null) }),
    map(user => {
      if (!user) return toLogin();
      if (roles && !user.roles?.some(r => roles.includes(r))) return router.createUrlTree(['/forbidden']);
      return true;
    })
  );
};

/** Login and sign-up are pointless once signed in: send the user to the catalog instead. */
export const guestGuard: CanActivateFn = () => {
  const store = inject(Store);
  return store.selectSnapshot(s => s.security.token) ? inject(Router).createUrlTree(['/courses']) : true;
};
