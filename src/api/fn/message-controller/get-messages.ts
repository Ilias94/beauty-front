/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { MessageDtoResponse } from '../../models/message-dto-response';

export interface GetMessages$Params {
  partnerId: number;
}

export function getMessages(http: HttpClient, rootUrl: string, params: GetMessages$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<MessageDtoResponse>>> {
  const rb = new RequestBuilder(rootUrl, getMessages.PATH, 'get');
  if (params) {
    rb.path('partnerId', params.partnerId, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Array<MessageDtoResponse>>;
    })
  );
}

getMessages.PATH = '/api/v1/messages/{partnerId}';
