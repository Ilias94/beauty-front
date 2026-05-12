import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { SecurityState } from './components/state/security.state';

export const authGuard: CanActivateFn = (route) => {
  const store = inject(Store);
  const router = inject(Router);
  const roles: string[] | undefined = route.data['roles'];

  const user = store.selectSnapshot(SecurityState.getCurrentUser);

  if (!user) {
    router.navigate(['/forbidden']);
    return false;
  }

  if (roles && !user.roles?.some(r => roles.includes(r))) {
    router.navigate(['/forbidden']);
    return false;
  }

  return true;
};
