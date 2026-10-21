/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { ConnectStatusDtoResponse } from '../../models/connect-status-dto-response';

export interface GetStripeConnectStatus$Params {
}

export function getStripeConnectStatus(http: HttpClient, rootUrl: string, params?: GetStripeConnectStatus$Params, context?: HttpContext): Observable<StrictHttpResponse<ConnectStatusDtoResponse>> {
  const rb = new RequestBuilder(rootUrl, getStripeConnectStatus.PATH, 'get');
  if (params) {
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<ConnectStatusDtoResponse>;
    })
  );
}

getStripeConnectStatus.PATH = '/api/v1/connect/status';
