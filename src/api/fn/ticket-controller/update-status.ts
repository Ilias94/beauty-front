/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { TicketDto } from '../../models/ticket-dto';
import { TicketStatusUpdateDto } from '../../models/ticket-status-update-dto';

export interface UpdateStatus$Params {
  id: number;
      body: TicketStatusUpdateDto
}

export function updateStatus(http: HttpClient, rootUrl: string, params: UpdateStatus$Params, context?: HttpContext): Observable<StrictHttpResponse<TicketDto>> {
  const rb = new RequestBuilder(rootUrl, updateStatus.PATH, 'patch');
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

updateStatus.PATH = '/api/v1/tickets/{id}/status';
