/* tslint:disable */
/* eslint-disable */
import { QuestionDetailDto } from '../models/question-detail-dto';
export interface QuestionDtoRequest {
  courseId?: number;
  questionDetail?: Array<QuestionDetailDto>;
}
