/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { CourseMessageDtoRequest } from '../../models/course-message-dto-request';
import { CourseMessageDtoResponse } from '../../models/course-message-dto-response';

export interface Send1$Params {
  courseId: number;
      body: CourseMessageDtoRequest
}

export function send1(http: HttpClient, rootUrl: string, params: Send1$Params, context?: HttpContext): Observable<StrictHttpResponse<CourseMessageDtoResponse>> {
  const rb = new RequestBuilder(rootUrl, send1.PATH, 'post');
  if (params) {
    rb.path('courseId', params.courseId, {});
    rb.body(params.body, 'application/json');
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<CourseMessageDtoResponse>;
    })
  );
}

send1.PATH = '/api/v1/courses/{courseId}/messages';
