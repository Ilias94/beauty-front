/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { CourseDto } from '../../models/course-dto';

export interface GetCourseById$Params {
  id: number;
}

export function getCourseById(http: HttpClient, rootUrl: string, params: GetCourseById$Params, context?: HttpContext): Observable<StrictHttpResponse<CourseDto>> {
  const rb = new RequestBuilder(rootUrl, getCourseById.PATH, 'get');
  if (params) {
    rb.path('id', params.id, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<CourseDto>;
    })
  );
}

getCourseById.PATH = '/api/v1/courses/{id}';
