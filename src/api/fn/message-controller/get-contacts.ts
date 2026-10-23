/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { ContactDtoResponse } from '../../models/contact-dto-response';

export interface GetContacts$Params {
}

export function getContacts(http: HttpClient, rootUrl: string, params?: GetContacts$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<ContactDtoResponse>>> {
  const rb = new RequestBuilder(rootUrl, getContacts.PATH, 'get');
  if (params) {
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Array<ContactDtoResponse>>;
    })
  );
}

getContacts.PATH = '/api/v1/messages/contacts';
