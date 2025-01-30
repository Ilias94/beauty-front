import { Injectable } from '@angular/core';
import { State, Action, StateContext } from '@ngxs/store';
import { GetCurrentUserRatingByCourseIdAction, SaveRatingAction } from './rating.actions';
import { RatingControllerService } from '../../../api/services';
import { getCurrentUserRatingByCourseId } from '../../../api/fn/rating-controller/get-current-user-rating-by-course-id';
import { tap } from 'rxjs';
import { response } from 'express';
import { RatingDto } from '../../../api/models/rating-dto';

export class RatingStateModel {
  public currentUserRating: RatingDto;
}

const defaults = {
  currentUserRating: {
    value:null
  }
};

@State<RatingStateModel>({
  name: 'rating',
  defaults
})
@Injectable()
export class RatingState {
  constructor(private ratingController: RatingControllerService) { }

  @Action(SaveRatingAction)
  saveRating({ }: StateContext<RatingStateModel>, { rating }: SaveRatingAction) {
    return this.ratingController.saveRating({ body: rating })
  }

  @Action(GetCurrentUserRatingByCourseIdAction)
  getCurrentUserRating({patchState }: StateContext<RatingStateModel>, { courseId }: GetCurrentUserRatingByCourseIdAction) {
    return this.ratingController.getCurrentUserRatingByCourseId({courseId}).pipe(tap(response => {
      patchState({currentUserRating: response})
    }))
  }
}
