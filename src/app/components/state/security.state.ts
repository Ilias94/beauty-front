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
import { environment } from '../../../environments/enfironment';

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


      // LoginComponent navigates afterwards (to the page the user came from).
      dispatch(new GetCurrentUserAction())
    }))
  }

  @Action(LoginFromLocalStorageAction)
  loginFromLocalStorage({ patchState, dispatch }: StateContext<SecurityStateModel>) {

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // OAuth2 (Google) sets token as a cookie — check it first, no localStorage date required
    const cookieToken = this.coockieService.get('token');
    if (cookieToken) {
      patchState({ token: cookieToken });
      this.webSocketService.connect();
      dispatch(new GetCurrentUserAction());
      return;
    }

    // Regular email/password login — token and date are in localStorage
    const currentDate = localStorage.getItem('currentDate');
    if (!currentDate) {
      // Never signed in on this device: a guest browsing the public catalog.
      return;
    }
    if (moment().subtract(1, 'days').isAfter(moment(currentDate))) {
      // Expired session: clear it, but let the visitor stay on the page they opened.
      dispatch(new LogoutAction(false));
      return;
    }

    const storageToken = localStorage.getItem('token');
    if (!storageToken) {
      return;
    }

    patchState({ token: storageToken });
    this.webSocketService.connect();
    dispatch(new GetCurrentUserAction());
  }


  @Action(RegisterAction)
  register({ dispatch }: StateContext<SecurityStateModel>, { user, file }: RegisterAction) {
    const formdata = new FormData();
    // Spring @RequestPart requires application/json content-type to deserialize with Jackson
    formdata.append('user', new Blob([JSON.stringify(user)], { type: 'application/json' }));
    if (file) {
      formdata.append('file', file);
    }
    return this.httpClient.post(`${environment.apiUrl}/api/v1/users`, formdata).pipe(
      tap(() => dispatch(new Navigate(['/login'])))
    );
  }

  @Action(LogoutAction)
  logout({ patchState, dispatch }: StateContext<SecurityStateModel>, { redirectToLogin }: LogoutAction) {
    if (isPlatformBrowser(this.platformId)) {
      this.webSocketService.disconnect();
      localStorage.removeItem('token');
      localStorage.removeItem('currentDate');
      this.coockieService.delete('token');
      this.coockieService.delete('token', '/');
    }
    patchState({ token: null, currentUser: null });
    if (redirectToLogin) {
      dispatch(new Navigate(['/login']));
    }
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
