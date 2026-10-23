/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { ConversationDtoResponse } from '../../models/conversation-dto-response';

export interface GetConversations$Params {
}

export function getConversations(http: HttpClient, rootUrl: string, params?: GetConversations$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<ConversationDtoResponse>>> {
  const rb = new RequestBuilder(rootUrl, getConversations.PATH, 'get');
  if (params) {
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Array<ConversationDtoResponse>>;
    })
  );
}

getConversations.PATH = '/api/v1/messages/conversations';
