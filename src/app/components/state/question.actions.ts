import { QuestionDtoRequest } from "../../../api/models";

export class CreateQuestionAction {
  static readonly type = '[Question] Create Question';
  constructor(public question: QuestionDtoRequest) { }
}

export class UpdateQuestionAction {
  static readonly type = '[Question] Update Question';
  constructor(public question: QuestionDtoRequest) { }
}

export class FindQuestionByCourseIdAction {
  static readonly type = '[Question] Find Question By Course Id';
  constructor(public courseId: number) { }
}

export class DeleteQuestionAction {
  static readonly type = '[Question] Delete Question';
  constructor(public id: number) {}
}