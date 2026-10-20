/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { CourseMessageDtoResponse } from '../models/course-message-dto-response';
import { getCourseMessages } from '../fn/course-message-controller/get-course-messages';
import { GetCourseMessages$Params } from '../fn/course-message-controller/get-course-messages';
import { send1 } from '../fn/course-message-controller/send-1';
import { Send1$Params } from '../fn/course-message-controller/send-1';

@Injectable({ providedIn: 'root' })
export class CourseMessageControllerService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `getCourseMessages()` */
  static readonly GetCourseMessagesPath = '/api/v1/courses/{courseId}/messages';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getCourseMessages()` instead.
   *
   * This method doesn't expect any request body.
   */
  getCourseMessages$Response(params: GetCourseMessages$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<CourseMessageDtoResponse>>> {
    return getCourseMessages(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getCourseMessages$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getCourseMessages(params: GetCourseMessages$Params, context?: HttpContext): Observable<Array<CourseMessageDtoResponse>> {
    return this.getCourseMessages$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<CourseMessageDtoResponse>>): Array<CourseMessageDtoResponse> => r.body)
    );
  }

  /** Path part for operation `send1()` */
  static readonly Send1Path = '/api/v1/courses/{courseId}/messages';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `send1()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  send1$Response(params: Send1$Params, context?: HttpContext): Observable<StrictHttpResponse<CourseMessageDtoResponse>> {
    return send1(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `send1$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  send1(params: Send1$Params, context?: HttpContext): Observable<CourseMessageDtoResponse> {
    return this.send1$Response(params, context).pipe(
      map((r: StrictHttpResponse<CourseMessageDtoResponse>): CourseMessageDtoResponse => r.body)
    );
  }

}
