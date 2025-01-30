/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { RatingDto } from '../../models/rating-dto';

export interface GetCurrentUserRatingByCourseId$Params {
  courseId: number;
}

export function getCurrentUserRatingByCourseId(http: HttpClient, rootUrl: string, params: GetCurrentUserRatingByCourseId$Params, context?: HttpContext): Observable<StrictHttpResponse<RatingDto>> {
  const rb = new RequestBuilder(rootUrl, getCurrentUserRatingByCourseId.PATH, 'get');
  if (params) {
    rb.path('courseId', params.courseId, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<RatingDto>;
    })
  );
}

getCurrentUserRatingByCourseId.PATH = '/api/v1/rating/{courseId}';
