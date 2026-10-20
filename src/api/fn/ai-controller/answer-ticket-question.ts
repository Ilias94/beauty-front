/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { AiTicketResponseDto } from '../../models/ai-ticket-response-dto';

export interface AnswerTicketQuestion$Params {
  question: string;
}

export function answerTicketQuestion(http: HttpClient, rootUrl: string, params: AnswerTicketQuestion$Params, context?: HttpContext): Observable<StrictHttpResponse<AiTicketResponseDto>> {
  const rb = new RequestBuilder(rootUrl, answerTicketQuestion.PATH, 'get');
  if (params) {
    rb.query('question', params.question, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<AiTicketResponseDto>;
    })
  );
}

answerTicketQuestion.PATH = '/api/v1/ai';
