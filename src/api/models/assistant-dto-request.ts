/* tslint:disable */
/* eslint-disable */
import { Turn } from '../models/turn';
export interface AssistantDtoRequest {
  history?: Array<Turn>;
  message: string;
}
