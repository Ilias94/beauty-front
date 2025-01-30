/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { CommentDto } from '../../models/comment-dto';

export interface GetComments$Params {
  courseId: number;
}

export function getComments(http: HttpClient, rootUrl: string, params: GetComments$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<CommentDto>>> {
  const rb = new RequestBuilder(rootUrl, getComments.PATH, 'get');
  if (params) {
    rb.path('courseId', params.courseId, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Array<CommentDto>>;
    })
  );
}

getComments.PATH = '/api/v1/comment/{courseId}';
