/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { CourseImageDto } from '../../models/course-image-dto';

export interface DeleteCourseImage$Params {
  courseId: number;
  imageId: number;
}

export function deleteCourseImage(http: HttpClient, rootUrl: string, params: DeleteCourseImage$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<CourseImageDto>>> {
  const rb = new RequestBuilder(rootUrl, deleteCourseImage.PATH, 'delete');
  if (params) {
    rb.path('courseId', params.courseId, {});
    rb.path('imageId', params.imageId, {});
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

deleteCourseImage.PATH = '/api/v1/courses/{courseId}/images/{imageId}';
