/* tslint:disable */
/* eslint-disable */
import { Answer } from '../models/answer';
export interface QuestionDetailDto {
  answers?: Array<Answer>;
  priority?: number;
  question?: string;
}
