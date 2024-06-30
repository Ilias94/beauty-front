import { Injectable } from '@angular/core';
import { State, Action, StateContext } from '@ngxs/store';
import { GetCurrentUserAction, LoginAction, LoginFromLocalStorageAction, LogoutAction, RegisterAction } from './security.actions';
import { LoginControllerService, UserControllerService } from '../../../api/services';
import { tap } from 'rxjs';
import { UserDto } from '../../../api/models';
import moment from 'moment';

import { Navigate } from '@ngxs/router-plugin';
export class SecurityStateModel {
  public token: string;
  public currentUser: UserDto;
}

const defaults = {
  token: null,
  currentUser: null
};

@State<SecurityStateModel>({
  name: 'security',
  defaults
})
@Injectable()
export class SecurityState {
  constructor(private loginControllerService: LoginControllerService,
    private userControllerService: UserControllerService) { }
  @Action(LoginAction)
  login({ patchState, dispatch }: StateContext<SecurityStateModel>, { email, password }: LoginAction) {
    return this.loginControllerService.login({ body: { email, password } }).pipe(tap(response => {
      patchState({ token: response.token })
      localStorage.setItem("token", response.token)
      localStorage.setItem("currentDate", moment().toISOString())
      dispatch(new GetCurrentUserAction())
    }))
  }

  @Action(LoginFromLocalStorageAction)
  loginFromLocalStorage({patchState, dispatch}: StateContext<SecurityStateModel>, {}: LoginFromLocalStorageAction) {
   const currentDate = localStorage.getItem("currentDate")
   if(moment().subtract(1, "days").isAfter(moment(currentDate)) || !currentDate) {
    dispatch(new LogoutAction())
    return
   }
    patchState({token: localStorage.getItem("token")}) 
    dispatch(new GetCurrentUserAction())
  }

  @Action(RegisterAction)
  register({ }: StateContext<SecurityStateModel>, { user }: RegisterAction) {
    return this.userControllerService.saveUser({ body: user })
  }

  @Action(LogoutAction)
  logout({ patchState, dispatch }: StateContext<SecurityStateModel>) {
    patchState({ token: null })
    localStorage.removeItem("token")
    localStorage.removeItem("currentDate")
    dispatch(new Navigate(["/login"]))
  }

  @Action(GetCurrentUserAction)
  getCurrentUser({patchState }: StateContext<SecurityStateModel>) {
    return this.userControllerService.getCurrentLoginUser().pipe(
      tap(response => {
        patchState({currentUser: response})
      })
    )
  }
} 
