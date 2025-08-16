/* tslint:disable */
/* eslint-disable */
export interface UserDtoResponse {
  confirmPassword?: string;
  createdBy?: string;
  createdDate?: string;
  email: string;
  fileName?: string;
  firstName: string;
  id?: number;
  lastModifiedBy?: string;
  lastModifiedDate?: string;
  lastName: string;
  password: string;
  revisionNumber?: number;
  revisionType?: 'UNKNOWN' | 'INSERT' | 'UPDATE' | 'DELETE';
  roles?: Array<string>;
  teacher?: boolean;
}
