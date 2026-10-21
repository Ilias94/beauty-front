/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { PaymentStatusDtoResponse } from '../../models/payment-status-dto-response';

export interface GetPaymentStatus$Params {
  orderId: string;
}

export function getPaymentStatus(http: HttpClient, rootUrl: string, params: GetPaymentStatus$Params, context?: HttpContext): Observable<StrictHttpResponse<PaymentStatusDtoResponse>> {
  const rb = new RequestBuilder(rootUrl, getPaymentStatus.PATH, 'get');
  if (params) {
    rb.path('orderId', params.orderId, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<PaymentStatusDtoResponse>;
    })
  );
}

getPaymentStatus.PATH = '/api/v1/payment/{orderId}';
