/* tslint:disable */
/* eslint-disable */
import { AddressDto } from '../models/address-dto';
import { CategoryDto } from '../models/category-dto';
import { UserDto } from '../models/user-dto';
export interface CourseDto {
  address?: AddressDto;
  category?: CategoryDto;
  creator?: UserDto;
  description?: string;
  endDate?: string;
  id?: number;
  maxParticipants?: number;
  price?: number;
  rating?: number;
  startDate?: string;
  title?: string;
}
