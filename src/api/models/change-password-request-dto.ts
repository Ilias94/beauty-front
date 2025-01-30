/* tslint:disable */
/* eslint-disable */
export interface ChangePasswordRequestDto {
  confirmNewPassword: string;
  newPassword: string;
  oldPassword: string;
  userId?: number;
}
