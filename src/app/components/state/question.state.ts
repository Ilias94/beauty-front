import { Injectable } from '@angular/core';
import { State, Action, StateContext } from '@ngxs/store';
import { CreateQuestionAction, DeleteQuestionAction, FindQuestionByCourseIdAction, UpdateQuestionAction } from './question.actions';
import { QuestionControllerService } from '../../../api/services';
import { QuestionDtoResponse } from '../../../api/models';
import { tap } from 'rxjs';

export class QuestionStateModel {
  public questionResponses: QuestionDtoResponse[];
}

const defaults = {
  questionResponses: []
};

@State<QuestionStateModel>({
  name: 'question',
  defaults
})
@Injectable()
export class QuestionState {
  constructor(private questionService: QuestionControllerService) { }

  @Action(CreateQuestionAction)
  createQuestion({ }: StateContext<QuestionStateModel>, { question }: CreateQuestionAction) {
    console.log(question);
    return this.questionService.create({ body: question });
  }

  // @Action(UpdateQuestionAction)
  // updateQuestion({ }: StateContext<QuestionStateModel>, { question }: UpdateQuestionAction) {
  //   return this.questionService.update({ body: question });
  // }

  @Action(FindQuestionByCourseIdAction)
  findQuestionByCourseId({ patchState }: StateContext<QuestionStateModel>, { courseId }: FindQuestionByCourseIdAction) {
    return this.questionService.findQuestionsByCourseId({ courseId }).pipe(tap(response => {
      patchState({ questionResponses: response })
    }))
  }

  @Action(DeleteQuestionAction)
  DeleteQuestionAction({ }: StateContext<QuestionStateModel>, { id }: DeleteQuestionAction) {
    return this.questionService.delete({ id });
  }
}
