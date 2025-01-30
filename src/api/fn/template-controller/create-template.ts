/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { TemplateDto } from '../../models/template-dto';

export interface CreateTemplate$Params {
      body: TemplateDto
}

export function createTemplate(http: HttpClient, rootUrl: string, params: CreateTemplate$Params, context?: HttpContext): Observable<StrictHttpResponse<TemplateDto>> {
  const rb = new RequestBuilder(rootUrl, createTemplate.PATH, 'post');
  if (params) {
    rb.body(params.body, 'application/json');
  }

  return http.request(
    rb.build({ responseType: 'blob', accept: '*/*', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<TemplateDto>;
    })
  );
}

createTemplate.PATH = '/api/templates';
