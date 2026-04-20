/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { create } from '../fn/question-controller/create';
import { Create$Params } from '../fn/question-controller/create';
import { delete$ } from '../fn/question-controller/delete';
import { Delete$Params } from '../fn/question-controller/delete';
import { findQuestionsByCourseId } from '../fn/question-controller/find-questions-by-course-id';
import { FindQuestionsByCourseId$Params } from '../fn/question-controller/find-questions-by-course-id';
import { QuestionDtoResponse } from '../models/question-dto-response';

@Injectable({ providedIn: 'root' })
export class QuestionControllerService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `findQuestionsByCourseId()` */
  static readonly FindQuestionsByCourseIdPath = '/api/v1/questions';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `findQuestionsByCourseId()` instead.
   *
   * This method doesn't expect any request body.
   */
  findQuestionsByCourseId$Response(params: FindQuestionsByCourseId$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<QuestionDtoResponse>>> {
    return findQuestionsByCourseId(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `findQuestionsByCourseId$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  findQuestionsByCourseId(params: FindQuestionsByCourseId$Params, context?: HttpContext): Observable<Array<QuestionDtoResponse>> {
    return this.findQuestionsByCourseId$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<QuestionDtoResponse>>): Array<QuestionDtoResponse> => r.body)
    );
  }

  /** Path part for operation `create()` */
  static readonly CreatePath = '/api/v1/questions';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `create()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  create$Response(params: Create$Params, context?: HttpContext): Observable<StrictHttpResponse<void>> {
    return create(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `create$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  create(params: Create$Params, context?: HttpContext): Observable<void> {
    return this.create$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

  /** Path part for operation `delete()` */
  static readonly DeletePath = '/api/v1/questions/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `delete()` instead.
   *
   * This method doesn't expect any request body.
   */
  delete$Response(params: Delete$Params, context?: HttpContext): Observable<StrictHttpResponse<void>> {
    return delete$(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `delete$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  delete(params: Delete$Params, context?: HttpContext): Observable<void> {
    return this.delete$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

}
