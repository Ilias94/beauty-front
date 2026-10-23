/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { ask } from '../fn/assistant-controller/ask';
import { Ask$Params } from '../fn/assistant-controller/ask';
import { AssistantDtoResponse } from '../models/assistant-dto-response';

@Injectable({ providedIn: 'root' })
export class AssistantControllerService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `ask()` */
  static readonly AskPath = '/api/v1/assistant';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `ask()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  ask$Response(params: Ask$Params, context?: HttpContext): Observable<StrictHttpResponse<AssistantDtoResponse>> {
    return ask(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `ask$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  ask(params: Ask$Params, context?: HttpContext): Observable<AssistantDtoResponse> {
    return this.ask$Response(params, context).pipe(
      map((r: StrictHttpResponse<AssistantDtoResponse>): AssistantDtoResponse => r.body)
    );
  }

}
