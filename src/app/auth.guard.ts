import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { State, Store } from '@ngxs/store';


export const authGuard: CanActivateFn = (route, state) => { 
  const roles = route.data["roles"]
  const currentUser = inject(Store).selectSnapshot(state => state.security.currentUser)
  if ((!roles && currentUser) || currentUser?.roles?.some(userRole => roles?.some(role => userRole === role))) {
    return true
  }
  inject(Router).navigate(["/forbidden"])
  return false;
};
