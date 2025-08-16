/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { getParticipants } from '../fn/participants-controller/get-participants';
import { GetParticipants$Params } from '../fn/participants-controller/get-participants';
import { UserDtoResponse } from '../models/user-dto-response';

@Injectable({ providedIn: 'root' })
export class ParticipantsControllerService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `getParticipants()` */
  static readonly GetParticipantsPath = '/api/v1/participants/{courseId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getParticipants()` instead.
   *
   * This method doesn't expect any request body.
   */
  getParticipants$Response(params: GetParticipants$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<UserDtoResponse>>> {
    return getParticipants(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getParticipants$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getParticipants(params: GetParticipants$Params, context?: HttpContext): Observable<Array<UserDtoResponse>> {
    return this.getParticipants$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<UserDtoResponse>>): Array<UserDtoResponse> => r.body)
    );
  }

}
