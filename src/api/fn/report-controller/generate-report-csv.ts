/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';


export interface GenerateReportCsv$Params {
  courseId: number;
}

export function generateReportCsv(http: HttpClient, rootUrl: string, params: GenerateReportCsv$Params, context?: HttpContext): Observable<StrictHttpResponse<Blob>> {
  const rb = new RequestBuilder(rootUrl, generateReportCsv.PATH, 'get');
  if (params) {
    rb.query('courseId', params.courseId, {});
  }

  return http.request(
    rb.build({ responseType: 'blob', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Blob>;
    })
  );
}

generateReportCsv.PATH = '/api/v1/report/csv';
