/* tslint:disable */
/* eslint-disable */
import { CourseDtoResponse } from '../models/course-dto-response';
import { PageableObject } from '../models/pageable-object';
import { SortObject } from '../models/sort-object';
export interface PageCourseDtoResponse {
  content?: Array<CourseDtoResponse>;
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
