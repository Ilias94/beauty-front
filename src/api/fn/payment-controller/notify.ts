/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';


export interface Notify$Params {
  status: 'IN_PROGRESS' | 'FAILED' | 'SUCCESS';
  corelationKey: string;
}

export function notify(http: HttpClient, rootUrl: string, params: Notify$Params, context?: HttpContext): Observable<StrictHttpResponse<{
}>> {
  const rb = new RequestBuilder(rootUrl, notify.PATH, 'get');
  if (params) {
    rb.query('status', params.status, {});
    rb.query('corelationKey', params.corelationKey, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<{
      }>;
    })
  );
}

notify.PATH = '/api/v1/payment/notify';
