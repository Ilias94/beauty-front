/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { generateReportCsv } from '../fn/report-controller/generate-report-csv';
import { GenerateReportCsv$Params } from '../fn/report-controller/generate-report-csv';
import { generateReportExcel } from '../fn/report-controller/generate-report-excel';
import { GenerateReportExcel$Params } from '../fn/report-controller/generate-report-excel';

@Injectable({ providedIn: 'root' })
export class ReportControllerService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `generateReportExcel()` */
  static readonly GenerateReportExcelPath = '/api/v1/report/excel';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `generateReportExcel()` instead.
   *
   * This method doesn't expect any request body.
   */
  generateReportExcel$Response(params: GenerateReportExcel$Params, context?: HttpContext): Observable<StrictHttpResponse<Blob>> {
    return generateReportExcel(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `generateReportExcel$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  generateReportExcel(params: GenerateReportExcel$Params, context?: HttpContext): Observable<Blob> {
    return this.generateReportExcel$Response(params, context).pipe(
      map((r: StrictHttpResponse<Blob>): Blob => r.body)
    );
  }

  /** Path part for operation `generateReportCsv()` */
  static readonly GenerateReportCsvPath = '/api/v1/report/csv';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `generateReportCsv()` instead.
   *
   * This method doesn't expect any request body.
   */
  generateReportCsv$Response(params: GenerateReportCsv$Params, context?: HttpContext): Observable<StrictHttpResponse<Blob>> {
    return generateReportCsv(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `generateReportCsv$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  generateReportCsv(params: GenerateReportCsv$Params, context?: HttpContext): Observable<Blob> {
    return this.generateReportCsv$Response(params, context).pipe(
      map((r: StrictHttpResponse<Blob>): Blob => r.body)
    );
  }

}
