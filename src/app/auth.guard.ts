import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { State, Store } from '@ngxs/store';
import { SecurityState } from './components/state/security.state';
import { delay, filter, map, of, switchMap, take } from 'rxjs';
import { LoginFromLocalStorageAction } from './components/state/security.actions';




export const authGuard: CanActivateFn = async (route, state) => {
  const roles = route.data["roles"]
  
  const router = inject(Router)
  // return inject(Store).select(SecurityState.getCurrentUser).pipe(filter(user => !!user),
  //   map(user => {
  //     console.log(user)
  //     if ((!roles && user) || user?.roles?.some(userRole => roles?.some(role => userRole === role))) {
  //       return true;
  //     }
  //     router.navigate(["/forbidden"])
  //     return false;
  //   }
  //   ))
  // #todo have to finish race condition issue 
  const store = inject(Store)
  // store.dispatch(new LoginFromLocalStorageAction())

  function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  await delay(1000)

  const currentUser = store.selectSnapshot(state => state.security.currentUser)
  console.log("before return")
  if ((!roles && currentUser) || currentUser?.roles?.some(userRole => roles?.some(role => userRole === role))) {
    return true
  }
  router.navigate(["/forbidden"])
  return false;
};
