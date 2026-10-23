/* tslint:disable */
/* eslint-disable */
import { AddressDtoResponse } from '../models/address-dto-response';
import { CategoryDtoResponse } from '../models/category-dto-response';
import { UserDtoResponse } from '../models/user-dto-response';
export interface CourseDtoResponse {
  address?: AddressDtoResponse;
  category?: CategoryDtoResponse;
  certificate?: boolean;
  courseLevel?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  courseType?: 'IN_PERSON' | 'ONLINE' | 'HYBRID';
  creator?: UserDtoResponse;
  description?: string;
  endDate?: string;
  id?: number;
  imageUrl?: string;
  language?: string;
  learningOutcomes?: string;
  maxParticipants?: number;
  parentCourseId?: number;
  participantCount?: number;
  prerequisites?: string;
  price?: number;
  rating?: number;
  ratingCount?: number;
  startDate?: string;
  status?: 'DRAFT' | 'PUBLISHED';
  title?: string;
}
