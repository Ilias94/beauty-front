/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { CourseDtoResponse } from '../../models/course-dto-response';

export interface FilterCoursesByDate$Params {
  from: string;
  to: string;
}

export function filterCoursesByDate(http: HttpClient, rootUrl: string, params: FilterCoursesByDate$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<CourseDtoResponse>>> {
  const rb = new RequestBuilder(rootUrl, filterCoursesByDate.PATH, 'get');
  if (params) {
    rb.query('from', params.from, {});
    rb.query('to', params.to, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Array<CourseDtoResponse>>;
    })
  );
}

filterCoursesByDate.PATH = '/api/v1/courses/dates-filter';
