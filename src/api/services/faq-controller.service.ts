/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { create1 } from '../fn/faq-controller/create-1';
import { Create1$Params } from '../fn/faq-controller/create-1';
import { deleteFaq } from '../fn/faq-controller/delete-faq';
import { DeleteFaq$Params } from '../fn/faq-controller/delete-faq';
import { FaqDtoResponse } from '../models/faq-dto-response';
import { getAll } from '../fn/faq-controller/get-all';
import { GetAll$Params } from '../fn/faq-controller/get-all';
import { getByQuestion } from '../fn/faq-controller/get-by-question';
import { GetByQuestion$Params } from '../fn/faq-controller/get-by-question';
import { getFaq } from '../fn/faq-controller/get-faq';
import { GetFaq$Params } from '../fn/faq-controller/get-faq';
import { reindexAll } from '../fn/faq-controller/reindex-all';
import { ReindexAll$Params } from '../fn/faq-controller/reindex-all';
import { update } from '../fn/faq-controller/update';
import { Update$Params } from '../fn/faq-controller/update';

@Injectable({ providedIn: 'root' })
export class FaqControllerService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `getFaq()` */
  static readonly GetFaqPath = '/api/v1/faq/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getFaq()` instead.
   *
   * This method doesn't expect any request body.
   */
  getFaq$Response(params: GetFaq$Params, context?: HttpContext): Observable<StrictHttpResponse<FaqDtoResponse>> {
    return getFaq(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getFaq$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getFaq(params: GetFaq$Params, context?: HttpContext): Observable<FaqDtoResponse> {
    return this.getFaq$Response(params, context).pipe(
      map((r: StrictHttpResponse<FaqDtoResponse>): FaqDtoResponse => r.body)
    );
  }

  /** Path part for operation `update()` */
  static readonly UpdatePath = '/api/v1/faq/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `update()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  update$Response(params: Update$Params, context?: HttpContext): Observable<StrictHttpResponse<FaqDtoResponse>> {
    return update(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `update$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  update(params: Update$Params, context?: HttpContext): Observable<FaqDtoResponse> {
    return this.update$Response(params, context).pipe(
      map((r: StrictHttpResponse<FaqDtoResponse>): FaqDtoResponse => r.body)
    );
  }

  /** Path part for operation `deleteFaq()` */
  static readonly DeleteFaqPath = '/api/v1/faq/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `deleteFaq()` instead.
   *
   * This method doesn't expect any request body.
   */
  deleteFaq$Response(params: DeleteFaq$Params, context?: HttpContext): Observable<StrictHttpResponse<void>> {
    return deleteFaq(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `deleteFaq$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  deleteFaq(params: DeleteFaq$Params, context?: HttpContext): Observable<void> {
    return this.deleteFaq$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

  /** Path part for operation `getAll()` */
  static readonly GetAllPath = '/api/v1/faq';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getAll()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAll$Response(params?: GetAll$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<FaqDtoResponse>>> {
    return getAll(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getAll$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAll(params?: GetAll$Params, context?: HttpContext): Observable<Array<FaqDtoResponse>> {
    return this.getAll$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<FaqDtoResponse>>): Array<FaqDtoResponse> => r.body)
    );
  }

  /** Path part for operation `create1()` */
  static readonly Create1Path = '/api/v1/faq';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `create1()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  create1$Response(params: Create1$Params, context?: HttpContext): Observable<StrictHttpResponse<FaqDtoResponse>> {
    return create1(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `create1$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  create1(params: Create1$Params, context?: HttpContext): Observable<FaqDtoResponse> {
    return this.create1$Response(params, context).pipe(
      map((r: StrictHttpResponse<FaqDtoResponse>): FaqDtoResponse => r.body)
    );
  }

  /** Path part for operation `reindexAll()` */
  static readonly ReindexAllPath = '/api/v1/faq/reindex';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `reindexAll()` instead.
   *
   * This method doesn't expect any request body.
   */
  reindexAll$Response(params?: ReindexAll$Params, context?: HttpContext): Observable<StrictHttpResponse<void>> {
    return reindexAll(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `reindexAll$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  reindexAll(params?: ReindexAll$Params, context?: HttpContext): Observable<void> {
    return this.reindexAll$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

  /** Path part for operation `getByQuestion()` */
  static readonly GetByQuestionPath = '/api/v1/faq/search';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getByQuestion()` instead.
   *
   * This method doesn't expect any request body.
   */
  getByQuestion$Response(params: GetByQuestion$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<FaqDtoResponse>>> {
    return getByQuestion(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getByQuestion$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getByQuestion(params: GetByQuestion$Params, context?: HttpContext): Observable<Array<FaqDtoResponse>> {
    return this.getByQuestion$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<FaqDtoResponse>>): Array<FaqDtoResponse> => r.body)
    );
  }

}
