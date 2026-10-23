/* tslint:disable */
/* eslint-disable */
import { AddressDtoResponse } from '../models/address-dto-response';
import { CategoryDtoResponse } from '../models/category-dto-response';
import { UserDtoRequest } from '../models/user-dto-request';
export interface CourseDtoRequest {
  address?: AddressDtoResponse;
  category?: CategoryDtoResponse;
  certificate?: boolean;
  courseLevel?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  courseType?: 'IN_PERSON' | 'ONLINE' | 'HYBRID';
  creator?: UserDtoRequest;
  description?: string;
  endDate?: string;
  imageUrl?: string;
  language?: string;
  learningOutcomes?: string;
  maxParticipants?: number;
  prerequisites?: string;
  price?: number;
  rating?: number;
  startDate?: string;
  status?: 'DRAFT' | 'PUBLISHED';
  title?: string;
}
