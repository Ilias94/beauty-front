import { Injectable } from '@angular/core';
import { State, Action, StateContext } from '@ngxs/store';
import { ClearCommentsAction, GetCommentsAction, GetCurrentUserCommentsAction, SaveCommentAction } from './comment.actions';
import { CommentControllerService } from '../../../api/services';
import { tap } from 'rxjs';
import { CommentDto } from '../../../api/models';
import { response } from 'express';

export class CommentStateModel {
  public comments: CommentDto[];
}

const defaults = {
  comments: []
};

@State<CommentStateModel>({
  name: 'comment',
  defaults
})
@Injectable()
export class CommentState {
  constructor(private commentControler: CommentControllerService) { }

  @Action(SaveCommentAction)
  saveComment({ }: StateContext<CommentStateModel>, { comment }: SaveCommentAction) {
    return this.commentControler.createComment({ body: comment })
  }

  @Action(GetCommentsAction)
  getComments({ patchState }: StateContext<CommentStateModel>, { courseId }: GetCommentsAction) {
    return this.commentControler.getComments({ courseId }).pipe(tap(response => {
      patchState({ comments: response })
    }))
  }

  @Action(GetCurrentUserCommentsAction)
  getCurrentUserComments({patchState} : StateContext<CommentStateModel>, {}: GetCurrentUserCommentsAction) {
    return this.commentControler.getCurrentUserComments().pipe(tap(response => {
      patchState({comments: response})
    }))
  }

  @Action(ClearCommentsAction)
  clearComments({patchState} : StateContext<CommentStateModel>, {}: ClearCommentsAction) {
    patchState({comments: []})
  }
}

