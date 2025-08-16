import { ChangePasswordDtoRequest, UserDtoRequest } from "../../../api/models";

export class ChangeUserDataAction {
  static readonly type = '[User] ChangeUserDataAction';
  public constructor(public user: UserDtoRequest) {
  }
}

export class ChangePasswordAction {
  static readonly type = '[User] ChangePasswordAction';
  public constructor(public changePassword: ChangePasswordDtoRequest) {
  }
}
