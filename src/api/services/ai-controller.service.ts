/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { AiTicketResponseDto } from '../models/ai-ticket-response-dto';
import { PromptResponseDto } from '../models/prompt-response-dto';
import { query } from '../fn/ai-controller/query';
import { Query$Params } from '../fn/ai-controller/query';
import { query1 } from '../fn/ai-controller/query-1';
import { Query1$Params } from '../fn/ai-controller/query-1';

@Injectable({ providedIn: 'root' })
export class AiControllerService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `query1()` */
  static readonly Query1Path = '/api/v1/ai';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `query1()` instead.
   *
   * This method doesn't expect any request body.
   */
  query1$Response(params: Query1$Params, context?: HttpContext): Observable<StrictHttpResponse<AiTicketResponseDto>> {
    return query1(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `query1$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  query1(params: Query1$Params, context?: HttpContext): Observable<AiTicketResponseDto> {
    return this.query1$Response(params, context).pipe(
      map((r: StrictHttpResponse<AiTicketResponseDto>): AiTicketResponseDto => r.body)
    );
  }

  /** Path part for operation `query()` */
  static readonly QueryPath = '/api/v1/ai';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `query()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  query$Response(params: Query$Params, context?: HttpContext): Observable<StrictHttpResponse<PromptResponseDto>> {
    return query(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `query$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  query(params: Query$Params, context?: HttpContext): Observable<PromptResponseDto> {
    return this.query$Response(params, context).pipe(
      map((r: StrictHttpResponse<PromptResponseDto>): PromptResponseDto => r.body)
    );
  }

}
