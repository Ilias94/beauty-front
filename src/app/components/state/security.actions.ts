import { UserDtoResponse } from "../../../api/models";


export class LoginAction {
  static readonly type = '[Security] LoginAction';
  constructor(public email: string, public password: string) {
  }
}

export class LoginFromLocalStorageAction {
  static readonly type = '[Security] LoginFromLocalStorageAction';
  constructor() {}
}

export class RegisterAction {
  static readonly type = '[Security] RegisterAction';
  constructor(public user: UserDtoResponse, public file: Blob) {
  }
}

export class LogoutAction {
  static readonly type = '[Security] LogoutAction'
  constructor() { }
}

export class GetCurrentUserAction {
  static readonly type = '[Security] GetCurrentUserAction'
  constructor() {}
}

