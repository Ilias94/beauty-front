/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { CommentDtoResponse } from '../models/comment-dto-response';
import { createComment } from '../fn/comment-controller/create-comment';
import { CreateComment$Params } from '../fn/comment-controller/create-comment';
import { getComments } from '../fn/comment-controller/get-comments';
import { GetComments$Params } from '../fn/comment-controller/get-comments';
import { getCurrentUserComments } from '../fn/comment-controller/get-current-user-comments';
import { GetCurrentUserComments$Params } from '../fn/comment-controller/get-current-user-comments';

@Injectable({ providedIn: 'root' })
export class CommentControllerService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `createComment()` */
  static readonly CreateCommentPath = '/api/v1/comment';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `createComment()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  createComment$Response(params: CreateComment$Params, context?: HttpContext): Observable<StrictHttpResponse<CommentDtoResponse>> {
    return createComment(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `createComment$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  createComment(params: CreateComment$Params, context?: HttpContext): Observable<CommentDtoResponse> {
    return this.createComment$Response(params, context).pipe(
      map((r: StrictHttpResponse<CommentDtoResponse>): CommentDtoResponse => r.body)
    );
  }

  /** Path part for operation `getComments()` */
  static readonly GetCommentsPath = '/api/v1/comment/{courseId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getComments()` instead.
   *
   * This method doesn't expect any request body.
   */
  getComments$Response(params: GetComments$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<CommentDtoResponse>>> {
    return getComments(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getComments$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getComments(params: GetComments$Params, context?: HttpContext): Observable<Array<CommentDtoResponse>> {
    return this.getComments$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<CommentDtoResponse>>): Array<CommentDtoResponse> => r.body)
    );
  }

  /** Path part for operation `getCurrentUserComments()` */
  static readonly GetCurrentUserCommentsPath = '/api/v1/comment/current';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getCurrentUserComments()` instead.
   *
   * This method doesn't expect any request body.
   */
  getCurrentUserComments$Response(params?: GetCurrentUserComments$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<CommentDtoResponse>>> {
    return getCurrentUserComments(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getCurrentUserComments$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getCurrentUserComments(params?: GetCurrentUserComments$Params, context?: HttpContext): Observable<Array<CommentDtoResponse>> {
    return this.getCurrentUserComments$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<CommentDtoResponse>>): Array<CommentDtoResponse> => r.body)
    );
  }

}
