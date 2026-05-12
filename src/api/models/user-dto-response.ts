/* tslint:disable */
/* eslint-disable */
export interface UserDtoResponse {
  createdBy?: string;
  createdDate?: string;
  email?: string;
  enrolledCourseIds?: Array<number>;
  fileName?: string;
  firstName?: string;
  id?: number;
  lastModifiedBy?: string;
  lastModifiedDate?: string;
  lastName?: string;
  ownedCourseIds?: Array<number>;
  revisionNumber?: number;
  revisionType?: 'UNKNOWN' | 'INSERT' | 'UPDATE' | 'DELETE';
  roles?: Array<string>;
  teacher?: boolean;
}
