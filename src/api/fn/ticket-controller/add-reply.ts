/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { AddReplyDto } from '../../models/add-reply-dto';
import { TicketDto } from '../../models/ticket-dto';

export interface AddReply$Params {
  id: number;
      body: AddReplyDto
}

export function addReply(http: HttpClient, rootUrl: string, params: AddReply$Params, context?: HttpContext): Observable<StrictHttpResponse<TicketDto>> {
  const rb = new RequestBuilder(rootUrl, addReply.PATH, 'post');
  if (params) {
    rb.path('id', params.id, {});
    rb.body(params.body, 'application/json');
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<TicketDto>;
    })
  );
}

addReply.PATH = '/api/v1/tickets/{id}/replies';
