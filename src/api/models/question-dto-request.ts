/* tslint:disable */
/* eslint-disable */
import { QuestionDetail } from '../models/question-detail';
export interface QuestionDtoRequest {
  courseId?: number;
  questionDetail?: Array<QuestionDetail>;
}
