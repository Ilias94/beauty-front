/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { VideoDtoResponse } from '../../models/video-dto-response';

export interface GetVideos$Params {
  courseId: number;
}

export function getVideos(http: HttpClient, rootUrl: string, params: GetVideos$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<VideoDtoResponse>>> {
  const rb = new RequestBuilder(rootUrl, getVideos.PATH, 'get');
  if (params) {
    rb.path('courseId', params.courseId, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Array<VideoDtoResponse>>;
    })
  );
}

getVideos.PATH = '/api/v1/video/{courseId}';
