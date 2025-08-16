/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { UserDtoResponse } from '../../models/user-dto-response';

export interface FindUserById$Params {
  id: number;
}

export function findUserById(http: HttpClient, rootUrl: string, params: FindUserById$Params, context?: HttpContext): Observable<StrictHttpResponse<UserDtoResponse>> {
  const rb = new RequestBuilder(rootUrl, findUserById.PATH, 'get');
  if (params) {
    rb.path('id', params.id, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<UserDtoResponse>;
    })
  );
}

findUserById.PATH = '/api/v1/users/{id}';
