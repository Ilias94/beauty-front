/* tslint:disable */
/* eslint-disable */
import { AddressDtoResponse } from '../models/address-dto-response';
import { CategoryDtoResponse } from '../models/category-dto-response';
import { UserDtoResponse } from '../models/user-dto-response';
export interface CourseDtoResponse {
  address?: AddressDtoResponse;
  category?: CategoryDtoResponse;
  creator?: UserDtoResponse;
  description?: string;
  endDate?: string;
  id?: number;
  maxParticipants?: number;
  price?: number;
  rating?: number;
  startDate?: string;
  title?: string;
}
