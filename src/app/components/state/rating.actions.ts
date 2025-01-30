import { RatingDto } from "../../../api/models";

export class SaveRatingAction {
  static readonly type = '[Rating] SaveRatingAction';
  constructor(public rating: RatingDto) { }
}

export class GetCurrentUserRatingByCourseIdAction {
  static readonly type = '[Rating] GetCurrentUserRatingByCourseIdAction';
  constructor(public courseId: number) { }
}

