/* tslint:disable */
/* eslint-disable */
import { PageableObject } from '../models/pageable-object';
import { SortObject } from '../models/sort-object';
import { UserDtoResponse } from '../models/user-dto-response';
export interface PageUserDtoResponse {
  content?: Array<UserDtoResponse>;
  empty?: boolean;
  first?: boolean;
  last?: boolean;
  number?: number;
  numberOfElements?: number;
  pageable?: PageableObject;
  size?: number;
  sort?: SortObject;
  totalElements?: number;
  totalPages?: number;
}
