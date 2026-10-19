/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { FaqDtoRequest } from '../../models/faq-dto-request';
import { FaqDtoResponse } from '../../models/faq-dto-response';

export interface Create1$Params {
      body: FaqDtoRequest
}

export function create1(http: HttpClient, rootUrl: string, params: Create1$Params, context?: HttpContext): Observable<StrictHttpResponse<FaqDtoResponse>> {
  const rb = new RequestBuilder(rootUrl, create1.PATH, 'post');
  if (params) {
    rb.body(params.body, 'application/json');
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

create1.PATH = '/api/v1/faq';
