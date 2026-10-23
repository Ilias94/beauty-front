/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { AssistantDtoRequest } from '../../models/assistant-dto-request';
import { AssistantDtoResponse } from '../../models/assistant-dto-response';

export interface Ask$Params {
      body: AssistantDtoRequest
}

export function ask(http: HttpClient, rootUrl: string, params: Ask$Params, context?: HttpContext): Observable<StrictHttpResponse<AssistantDtoResponse>> {
  const rb = new RequestBuilder(rootUrl, ask.PATH, 'post');
  if (params) {
    rb.body(params.body, 'application/json');
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<AssistantDtoResponse>;
    })
  );
}

ask.PATH = '/api/v1/assistant';
