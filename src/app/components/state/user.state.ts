import { Injectable } from '@angular/core';
import { State, Action, StateContext } from '@ngxs/store';
import { ChangePasswordAction, ChangeUserDataAction} from './user.actions';

export class UserStateModel {
  public items: string[];
}

const defaults = {
  items: []
};

@State<UserStateModel>({
  name: 'user',
  defaults
})
@Injectable()
export class UserState {
  @Action(ChangeUserDataAction)
  changeUserData({ }: StateContext<UserStateModel>, { user }: ChangeUserDataAction) {

  }

  @Action(ChangePasswordAction)
  changePassword({ }: StateContext<UserStateModel>, { changePassword }: ChangePasswordAction) {

  }
}
