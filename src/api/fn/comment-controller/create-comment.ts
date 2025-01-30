/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { CommentDto } from '../../models/comment-dto';

export interface CreateComment$Params {
      body: CommentDto
}

export function createComment(http: HttpClient, rootUrl: string, params: CreateComment$Params, context?: HttpContext): Observable<StrictHttpResponse<CommentDto>> {
  const rb = new RequestBuilder(rootUrl, createComment.PATH, 'post');
  if (params) {
    rb.body(params.body, 'application/json');
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<CommentDto>;
    })
  );
}

createComment.PATH = '/api/v1/comment';
