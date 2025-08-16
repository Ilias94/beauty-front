/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { CommentDtoRequest } from '../../models/comment-dto-request';
import { CommentDtoResponse } from '../../models/comment-dto-response';

export interface CreateComment$Params {
      body: CommentDtoRequest
}

export function createComment(http: HttpClient, rootUrl: string, params: CreateComment$Params, context?: HttpContext): Observable<StrictHttpResponse<CommentDtoResponse>> {
  const rb = new RequestBuilder(rootUrl, createComment.PATH, 'post');
  if (params) {
    rb.body(params.body, 'application/json');
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<CommentDtoResponse>;
    })
  );
}

createComment.PATH = '/api/v1/comment';
