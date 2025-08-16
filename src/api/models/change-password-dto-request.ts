/* tslint:disable */
/* eslint-disable */
export interface ChangePasswordDtoRequest {
  confirmNewPassword: string;
  newPassword: string;
  oldPassword: string;
  userId?: number;
}
