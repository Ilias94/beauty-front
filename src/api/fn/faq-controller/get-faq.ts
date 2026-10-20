/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { FaqDtoResponse } from '../../models/faq-dto-response';

export interface GetFaq$Params {
  id: string;
}

export function getFaq(http: HttpClient, rootUrl: string, params: GetFaq$Params, context?: HttpContext): Observable<StrictHttpResponse<FaqDtoResponse>> {
  const rb = new RequestBuilder(rootUrl, getFaq.PATH, 'get');
  if (params) {
    rb.path('id', params.id, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<FaqDtoResponse>;
    })
  );
}

getFaq.PATH = '/api/v1/faq/{id}';
