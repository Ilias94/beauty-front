import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { GetCurrentUserAction, LoginAction, LoginFromLocalStorageAction, LogoutAction, RegisterAction } from './security.actions';
import { LoginControllerService, UserControllerService } from '../../../api/services';
import { tap } from 'rxjs';
import moment from 'moment';

import { Navigate } from '@ngxs/router-plugin';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { UserDtoResponse } from '../../../api/models';
import { WebSocketService } from '../../core/websocket/websocket.service';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export class SecurityStateModel {
  public token: string;
  public currentUser: UserDtoResponse;
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
  constructor(
    private loginControllerService: LoginControllerService,
    private userControllerService: UserControllerService,
    private httpClient: HttpClient,
    private coockieService: CookieService,
    private webSocketService: WebSocketService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  @Action(LoginAction)
  login({ patchState, dispatch }: StateContext<SecurityStateModel>, { email, password }: LoginAction) {
    return this.loginControllerService.login({ body: { email, password } }).pipe(tap(response => {
      patchState({ token: response.token })
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem("token", response.token)
        localStorage.setItem("currentDate", moment().toISOString())

        this.webSocketService.connect();
      }


      dispatch(new GetCurrentUserAction())
      dispatch(new Navigate(['/my-account']))
    }))
  }

  @Action(LoginFromLocalStorageAction)
  loginFromLocalStorage({ patchState, dispatch }: StateContext<SecurityStateModel>) {

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const currentDate = localStorage.getItem('currentDate');

    if (!currentDate || moment().subtract(1, 'days').isAfter(moment(currentDate))) {
      dispatch(new LogoutAction());
      return;
    }

    const cookieToken = this.coockieService.get('token');

    if (cookieToken) {
      patchState({ token: cookieToken });
    } else {
      const storageToken = localStorage.getItem('token');
      if (!storageToken) {
        return;
      }
      patchState({ token: storageToken });
    }

    this.webSocketService.connect();
    dispatch(new GetCurrentUserAction());
  }


  @Action(RegisterAction)
  register({ }: StateContext<SecurityStateModel>, { user, file }: RegisterAction) {
    // return this.userControllerService.saveUser({ body: {user, file: null} })
    const formdata = new FormData()
    formdata.append("user", JSON.stringify(user))
    formdata.append("file", file)
    return this.httpClient.post("http://localhost:8080/api/v1/users", formdata)
  }

  @Action(LogoutAction)
logout({ patchState, dispatch }: StateContext<SecurityStateModel>) {

  if (isPlatformBrowser(this.platformId)) {
    this.webSocketService.disconnect();
    localStorage.removeItem('token');
    localStorage.removeItem('currentDate');
  }

  patchState({ token: null });
  dispatch(new Navigate(['/login']));
}


  @Action(GetCurrentUserAction)
  getCurrentUser({ patchState }: StateContext<SecurityStateModel>) {
    return this.userControllerService.getCurrentLoginUser().pipe(
      tap(response => {
        patchState({ currentUser: response })
      })
    )
  }

  @Selector()
  static getCurrentUser(securityStateModel: SecurityStateModel) {
    return securityStateModel.currentUser
  }
}
