/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { QuestionDtoResponse } from '../../models/question-dto-response';

export interface FindQuestionsByCourseId$Params {
  courseId: number;
}

export function findQuestionsByCourseId(http: HttpClient, rootUrl: string, params: FindQuestionsByCourseId$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<QuestionDtoResponse>>> {
  const rb = new RequestBuilder(rootUrl, findQuestionsByCourseId.PATH, 'get');
  if (params) {
    rb.query('courseId', params.courseId, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Array<QuestionDtoResponse>>;
    })
  );
}

findQuestionsByCourseId.PATH = '/api/v1/questions';
