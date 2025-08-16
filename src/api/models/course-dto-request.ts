/* tslint:disable */
/* eslint-disable */
import { AddressDtoResponse } from '../models/address-dto-response';
import { CategoryDtoResponse } from '../models/category-dto-response';
import { UserDtoRequest } from '../models/user-dto-request';
export interface CourseDtoRequest {
  address?: AddressDtoResponse;
  category?: CategoryDtoResponse;
  creator?: UserDtoRequest;
  description?: string;
  endDate?: string;
  maxParticipants?: number;
  price?: number;
  rating?: number;
  startDate?: string;
  title?: string;
}
