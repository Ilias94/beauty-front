/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { FaqDtoResponse } from '../../models/faq-dto-response';

export interface GetByQuestion$Params {
  question: string;
}

export function getByQuestion(http: HttpClient, rootUrl: string, params: GetByQuestion$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<FaqDtoResponse>>> {
  const rb = new RequestBuilder(rootUrl, getByQuestion.PATH, 'get');
  if (params) {
    rb.query('question', params.question, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Array<FaqDtoResponse>>;
    })
  );
}

getByQuestion.PATH = '/api/v1/faq/search';
