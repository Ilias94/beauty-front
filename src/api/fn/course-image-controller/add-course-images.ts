/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { CourseImageDto } from '../../models/course-image-dto';

export interface AddCourseImages$Params {
  courseId: number;
      body?: {
'files': Array<Blob>;
}
}

export function addCourseImages(http: HttpClient, rootUrl: string, params: AddCourseImages$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<CourseImageDto>>> {
  const rb = new RequestBuilder(rootUrl, addCourseImages.PATH, 'post');
  if (params) {
    rb.path('courseId', params.courseId, {});
    rb.body(params.body, 'multipart/form-data');
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

addCourseImages.PATH = '/api/v1/courses/{courseId}/images';
