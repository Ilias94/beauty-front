export class LoginAction {
  static readonly type = '[Security] LoginAction';
  constructor(public email: string, public password: string) {
    
   }
}
