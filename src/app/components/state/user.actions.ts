import { UserDto } from "../../../api/models";

export class ChangeUserDataAction {
  static readonly type = '[User] ChangeUserDataAction';
  public constructor(public user: UserDto) {
  }
}

export class ChangePasswordAction {
  static readonly type = '[User] ChangePasswordAction';
  public constructor(public changePassword: {}) {
  }
}
