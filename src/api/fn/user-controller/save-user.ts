/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { UserDtoRequest } from '../../models/user-dto-request';
import { UserDtoResponse } from '../../models/user-dto-response';

export interface SaveUser$Params {
      body?: {
'user': UserDtoRequest;
'file'?: Blob;
}
}

export function saveUser(http: HttpClient, rootUrl: string, params?: SaveUser$Params, context?: HttpContext): Observable<StrictHttpResponse<UserDtoResponse>> {
  const rb = new RequestBuilder(rootUrl, saveUser.PATH, 'post');
  if (params) {
    rb.body(params.body, 'application/json');
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

saveUser.PATH = '/api/v1/users';
