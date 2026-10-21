/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { ConnectLinkDtoResponse } from '../../models/connect-link-dto-response';

export interface CreateStripeDashboardLink$Params {
}

export function createStripeDashboardLink(http: HttpClient, rootUrl: string, params?: CreateStripeDashboardLink$Params, context?: HttpContext): Observable<StrictHttpResponse<ConnectLinkDtoResponse>> {
  const rb = new RequestBuilder(rootUrl, createStripeDashboardLink.PATH, 'post');
  if (params) {
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<ConnectLinkDtoResponse>;
    })
  );
}

createStripeDashboardLink.PATH = '/api/v1/connect/dashboard-link';
