/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { CourseDtoResponse } from '../../models/course-dto-response';
import { RepublishCourseRequest } from '../../models/republish-course-request';

export interface RepublishCourse$Params {
  id: number;
      body: RepublishCourseRequest
}

export function republishCourse(http: HttpClient, rootUrl: string, params: RepublishCourse$Params, context?: HttpContext): Observable<StrictHttpResponse<CourseDtoResponse>> {
  const rb = new RequestBuilder(rootUrl, republishCourse.PATH, 'post');
  if (params) {
    rb.path('id', params.id, {});
    rb.body(params.body, 'application/json');
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<CourseDtoResponse>;
    })
  );
}

republishCourse.PATH = '/api/v1/courses/{id}/republish';
