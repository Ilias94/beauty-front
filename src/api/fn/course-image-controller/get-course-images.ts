/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { CourseImageDto } from '../../models/course-image-dto';

export interface GetCourseImages$Params {
  courseId: number;
}

export function getCourseImages(http: HttpClient, rootUrl: string, params: GetCourseImages$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<CourseImageDto>>> {
  const rb = new RequestBuilder(rootUrl, getCourseImages.PATH, 'get');
  if (params) {
    rb.path('courseId', params.courseId, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Array<CourseImageDto>>;
    })
  );
}

getCourseImages.PATH = '/api/v1/courses/{courseId}/images';
