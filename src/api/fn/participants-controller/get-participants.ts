/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { UserDtoResponse } from '../../models/user-dto-response';

export interface GetParticipants$Params {
  courseId: number;
}

export function getParticipants(http: HttpClient, rootUrl: string, params: GetParticipants$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<UserDtoResponse>>> {
  const rb = new RequestBuilder(rootUrl, getParticipants.PATH, 'get');
  if (params) {
    rb.path('courseId', params.courseId, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Array<UserDtoResponse>>;
    })
  );
}

getParticipants.PATH = '/api/v1/participants/{courseId}';
