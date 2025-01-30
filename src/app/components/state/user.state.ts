import { Injectable } from '@angular/core';
import { State, Action, StateContext } from '@ngxs/store';
import { ChangePasswordAction, ChangeUserDataAction} from './user.actions';
import { UserControllerService } from '../../../api/services';
import { HttpClient } from '@angular/common/http';

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
constructor(private userControllerService: UserControllerService){}

  @Action(ChangeUserDataAction)
  changeUserData({ }: StateContext<UserStateModel>, { user }: ChangeUserDataAction) {

  }

  @Action(ChangePasswordAction)
  changePassword({ }: StateContext<UserStateModel>, { changePassword }: ChangePasswordAction) {
    return this.userControllerService.changePassword({body: changePassword})
  }
}
