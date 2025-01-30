/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { CommentDto } from '../../models/comment-dto';

export interface GetCurrentUserComments$Params {
}

export function getCurrentUserComments(http: HttpClient, rootUrl: string, params?: GetCurrentUserComments$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<CommentDto>>> {
  const rb = new RequestBuilder(rootUrl, getCurrentUserComments.PATH, 'get');
  if (params) {
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

getCurrentUserComments.PATH = '/api/v1/comment/current';
