/* tslint:disable */
/* eslint-disable */
export interface UserDtoRequest {
  confirmPassword?: string;
  email: string;
  fileName?: string;
  firstName: string;
  isTeacher?: boolean;
  lastName: string;
  password: string;
  revisionNumber?: number;
  revisionType?: 'UNKNOWN' | 'INSERT' | 'UPDATE' | 'DELETE';
  roles?: Array<string>;
}
