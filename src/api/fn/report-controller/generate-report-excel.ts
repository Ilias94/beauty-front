/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';


export interface GenerateReportExcel$Params {
  courseId: number;
}

export function generateReportExcel(http: HttpClient, rootUrl: string, params: GenerateReportExcel$Params, context?: HttpContext): Observable<StrictHttpResponse<Blob>> {
  const rb = new RequestBuilder(rootUrl, generateReportExcel.PATH, 'get');
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

generateReportExcel.PATH = '/api/v1/report/excel';
