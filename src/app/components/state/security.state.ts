import { Injectable } from '@angular/core';
import { State, Action, StateContext } from '@ngxs/store';
import { LoginAction } from './security.actions';
import { LoginControllerService } from '../../../api/services';

export class SecurityStateModel {
  public items: string[];
}

const defaults = {
  items: []
};

@State<SecurityStateModel>({
  name: 'security',
  defaults
})
@Injectable()
export class SecurityState {
  constructor(private loginControllerService: LoginControllerService){}
  @Action(LoginAction)
  login({ getState, setState }: StateContext<SecurityStateModel>, { email,password }: LoginAction) {
    return this.loginControllerService.login({body:{email,password}})
  }
}
