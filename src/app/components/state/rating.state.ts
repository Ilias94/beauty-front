import { Injectable } from '@angular/core';
import { State, Action, StateContext } from '@ngxs/store';
import { GetCurrentUserRatingByCourseIdAction, GetRatingSummaryAction, SaveRatingAction } from './rating.actions';
import { RatingControllerService } from '../../../api/services';
import { tap } from 'rxjs';
import { RatingDto } from '../../../api/models/rating-dto';
import { RatingSummaryDto } from '../../../api/models/rating-summary-dto';

export class RatingStateModel {
  public currentUserRating: RatingDto;
  /** A course's ratings: average, count and how many people gave each number of stars. */
  public summary: (RatingSummaryDto & { courseId: number }) | null;
}

const defaults = {
  currentUserRating: {
    value:null
  },
  summary: null
};

@State<RatingStateModel>({
  name: 'rating',
  defaults
})
@Injectable()
export class RatingState {
  constructor(private ratingController: RatingControllerService) { }

  @Action(SaveRatingAction)
  saveRating({ dispatch }: StateContext<RatingStateModel>, { rating }: SaveRatingAction) {
    // The backend recalculates the course's average right away, so the summary can follow.
    return this.ratingController.saveRating({ body: rating }).pipe(
      tap(() => dispatch(new GetRatingSummaryAction(rating.courseId!)))
    );
  }

  @Action(GetCurrentUserRatingByCourseIdAction)
  getCurrentUserRating({patchState }: StateContext<RatingStateModel>, { courseId }: GetCurrentUserRatingByCourseIdAction) {
    return this.ratingController.getCurrentUserRatingByCourseId({courseId}).pipe(tap(response => {
      patchState({currentUserRating: response})
    }))
  }

  @Action(GetRatingSummaryAction, { cancelUncompleted: true })
  getSummary({ patchState }: StateContext<RatingStateModel>, { courseId }: GetRatingSummaryAction) {
    return this.ratingController.getRatingSummary({ courseId }).pipe(
      tap(summary => patchState({ summary: { ...summary, courseId } }))
    );
  }
}
