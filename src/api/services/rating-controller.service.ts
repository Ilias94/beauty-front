/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { getCurrentUserRatingByCourseId } from '../fn/rating-controller/get-current-user-rating-by-course-id';
import { GetCurrentUserRatingByCourseId$Params } from '../fn/rating-controller/get-current-user-rating-by-course-id';
import { getRatingSummary } from '../fn/rating-controller/get-rating-summary';
import { GetRatingSummary$Params } from '../fn/rating-controller/get-rating-summary';
import { RatingDto } from '../models/rating-dto';
import { RatingSummaryDto } from '../models/rating-summary-dto';
import { saveRating } from '../fn/rating-controller/save-rating';
import { SaveRating$Params } from '../fn/rating-controller/save-rating';

@Injectable({ providedIn: 'root' })
export class RatingControllerService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `saveRating()` */
  static readonly SaveRatingPath = '/api/v1/rating';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `saveRating()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  saveRating$Response(params: SaveRating$Params, context?: HttpContext): Observable<StrictHttpResponse<RatingDto>> {
    return saveRating(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `saveRating$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  saveRating(params: SaveRating$Params, context?: HttpContext): Observable<RatingDto> {
    return this.saveRating$Response(params, context).pipe(
      map((r: StrictHttpResponse<RatingDto>): RatingDto => r.body)
    );
  }

  /** Path part for operation `getCurrentUserRatingByCourseId()` */
  static readonly GetCurrentUserRatingByCourseIdPath = '/api/v1/rating/{courseId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getCurrentUserRatingByCourseId()` instead.
   *
   * This method doesn't expect any request body.
   */
  getCurrentUserRatingByCourseId$Response(params: GetCurrentUserRatingByCourseId$Params, context?: HttpContext): Observable<StrictHttpResponse<RatingDto>> {
    return getCurrentUserRatingByCourseId(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getCurrentUserRatingByCourseId$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getCurrentUserRatingByCourseId(params: GetCurrentUserRatingByCourseId$Params, context?: HttpContext): Observable<RatingDto> {
    return this.getCurrentUserRatingByCourseId$Response(params, context).pipe(
      map((r: StrictHttpResponse<RatingDto>): RatingDto => r.body)
    );
  }

  /** Path part for operation `getRatingSummary()` */
  static readonly GetRatingSummaryPath = '/api/v1/rating/course/{courseId}/summary';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getRatingSummary()` instead.
   *
   * This method doesn't expect any request body.
   */
  getRatingSummary$Response(params: GetRatingSummary$Params, context?: HttpContext): Observable<StrictHttpResponse<RatingSummaryDto>> {
    return getRatingSummary(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getRatingSummary$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getRatingSummary(params: GetRatingSummary$Params, context?: HttpContext): Observable<RatingSummaryDto> {
    return this.getRatingSummary$Response(params, context).pipe(
      map((r: StrictHttpResponse<RatingSummaryDto>): RatingSummaryDto => r.body)
    );
  }

}
