/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { TemplateDto } from '../../models/template-dto';

export interface GetAllTemplates$Params {
}

export function getAllTemplates(http: HttpClient, rootUrl: string, params?: GetAllTemplates$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<TemplateDto>>> {
  const rb = new RequestBuilder(rootUrl, getAllTemplates.PATH, 'get');
  if (params) {
  }

  return http.request(
    rb.build({ responseType: 'blob', accept: '*/*', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Array<TemplateDto>>;
    })
  );
}

getAllTemplates.PATH = '/api/templates';
