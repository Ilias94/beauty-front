/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { PageCourseDto } from '../../models/page-course-dto';

export interface GetCourses$Params {
  page?: number;
  size?: number;
  categoryId?: number;
  title?: string;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
  isCurrentCreator?: boolean;
  isCurrentStudent?: boolean;
}

export function getCourses(http: HttpClient, rootUrl: string, params?: GetCourses$Params, context?: HttpContext): Observable<StrictHttpResponse<PageCourseDto>> {
  const rb = new RequestBuilder(rootUrl, getCourses.PATH, 'get');
  if (params) {
    rb.query('page', params.page, {});
    rb.query('size', params.size, {});
    rb.query('categoryId', params.categoryId, {});
    rb.query('title', params.title, {});
    rb.query('sortBy', params.sortBy, {});
    rb.query('sortDirection', params.sortDirection, {});
    rb.query('isCurrentCreator', params.isCurrentCreator, {});
    rb.query('isCurrentStudent', params.isCurrentStudent, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<PageCourseDto>;
    })
  );
}

getCourses.PATH = '/api/v1/courses';
