/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { CategoryDtoRequest } from '../../models/category-dto-request';
import { CategoryDtoResponse } from '../../models/category-dto-response';

export interface CreateCategory$Params {
      body: CategoryDtoRequest
}

export function createCategory(http: HttpClient, rootUrl: string, params: CreateCategory$Params, context?: HttpContext): Observable<StrictHttpResponse<CategoryDtoResponse>> {
  const rb = new RequestBuilder(rootUrl, createCategory.PATH, 'post');
  if (params) {
    rb.body(params.body, 'application/json');
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<CategoryDtoResponse>;
    })
  );
}

createCategory.PATH = '/api/v1/categories';
