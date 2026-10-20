/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { CourseMessageDtoResponse } from '../../models/course-message-dto-response';

export interface GetCourseMessages$Params {
  courseId: number;
}

export function getCourseMessages(http: HttpClient, rootUrl: string, params: GetCourseMessages$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<CourseMessageDtoResponse>>> {
  const rb = new RequestBuilder(rootUrl, getCourseMessages.PATH, 'get');
  if (params) {
    rb.path('courseId', params.courseId, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Array<CourseMessageDtoResponse>>;
    })
  );
}

getCourseMessages.PATH = '/api/v1/courses/{courseId}/messages';
