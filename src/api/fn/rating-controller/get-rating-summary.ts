/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { RatingSummaryDto } from '../../models/rating-summary-dto';

export interface GetRatingSummary$Params {
  courseId: number;
}

export function getRatingSummary(http: HttpClient, rootUrl: string, params: GetRatingSummary$Params, context?: HttpContext): Observable<StrictHttpResponse<RatingSummaryDto>> {
  const rb = new RequestBuilder(rootUrl, getRatingSummary.PATH, 'get');
  if (params) {
    rb.path('courseId', params.courseId, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<RatingSummaryDto>;
    })
  );
}

getRatingSummary.PATH = '/api/v1/rating/course/{courseId}/summary';
