/* tslint:disable */
/* eslint-disable */
import { AddressDto } from '../models/address-dto';
export interface CourseDto {
  address?: AddressDto;
  category?: string;
  creatorId?: number;
  description?: string;
  endDate?: string;
  id?: number;
  maxParticipants?: number;
  startDate?: string;
  title?: string;
}
