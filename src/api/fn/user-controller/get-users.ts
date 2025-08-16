/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { PageUserDtoResponse } from '../../models/page-user-dto-response';

export interface GetUsers$Params {
  page: number;
  size: number;
}

export function getUsers(http: HttpClient, rootUrl: string, params: GetUsers$Params, context?: HttpContext): Observable<StrictHttpResponse<PageUserDtoResponse>> {
  const rb = new RequestBuilder(rootUrl, getUsers.PATH, 'get');
  if (params) {
    rb.query('page', params.page, {});
    rb.query('size', params.size, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<PageUserDtoResponse>;
    })
  );
}

getUsers.PATH = '/api/v1/users';
