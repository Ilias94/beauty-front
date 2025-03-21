/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { CourseDto } from '../models/course-dto';
import { createCourse } from '../fn/course-controller/create-course';
import { CreateCourse$Params } from '../fn/course-controller/create-course';
import { deleteCourse } from '../fn/course-controller/delete-course';
import { DeleteCourse$Params } from '../fn/course-controller/delete-course';
import { getAutocompleteTitle } from '../fn/course-controller/get-autocomplete-title';
import { GetAutocompleteTitle$Params } from '../fn/course-controller/get-autocomplete-title';
import { getCourseById } from '../fn/course-controller/get-course-by-id';
import { GetCourseById$Params } from '../fn/course-controller/get-course-by-id';
import { getCourses } from '../fn/course-controller/get-courses';
import { GetCourses$Params } from '../fn/course-controller/get-courses';
import { PageCourseDto } from '../models/page-course-dto';
import { updateCourse } from '../fn/course-controller/update-course';
import { UpdateCourse$Params } from '../fn/course-controller/update-course';

@Injectable({ providedIn: 'root' })
export class CourseControllerService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `getCourseById()` */
  static readonly GetCourseByIdPath = '/api/v1/courses/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getCourseById()` instead.
   *
   * This method doesn't expect any request body.
   */
  getCourseById$Response(params: GetCourseById$Params, context?: HttpContext): Observable<StrictHttpResponse<CourseDto>> {
    return getCourseById(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getCourseById$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getCourseById(params: GetCourseById$Params, context?: HttpContext): Observable<CourseDto> {
    return this.getCourseById$Response(params, context).pipe(
      map((r: StrictHttpResponse<CourseDto>): CourseDto => r.body)
    );
  }

  /** Path part for operation `updateCourse()` */
  static readonly UpdateCoursePath = '/api/v1/courses/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `updateCourse()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  updateCourse$Response(params: UpdateCourse$Params, context?: HttpContext): Observable<StrictHttpResponse<CourseDto>> {
    return updateCourse(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `updateCourse$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  updateCourse(params: UpdateCourse$Params, context?: HttpContext): Observable<CourseDto> {
    return this.updateCourse$Response(params, context).pipe(
      map((r: StrictHttpResponse<CourseDto>): CourseDto => r.body)
    );
  }

  /** Path part for operation `deleteCourse()` */
  static readonly DeleteCoursePath = '/api/v1/courses/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `deleteCourse()` instead.
   *
   * This method doesn't expect any request body.
   */
  deleteCourse$Response(params: DeleteCourse$Params, context?: HttpContext): Observable<StrictHttpResponse<void>> {
    return deleteCourse(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `deleteCourse$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  deleteCourse(params: DeleteCourse$Params, context?: HttpContext): Observable<void> {
    return this.deleteCourse$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

  /** Path part for operation `getCourses()` */
  static readonly GetCoursesPath = '/api/v1/courses';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getCourses()` instead.
   *
   * This method doesn't expect any request body.
   */
  getCourses$Response(params?: GetCourses$Params, context?: HttpContext): Observable<StrictHttpResponse<PageCourseDto>> {
    return getCourses(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getCourses$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getCourses(params?: GetCourses$Params, context?: HttpContext): Observable<PageCourseDto> {
    return this.getCourses$Response(params, context).pipe(
      map((r: StrictHttpResponse<PageCourseDto>): PageCourseDto => r.body)
    );
  }

  /** Path part for operation `createCourse()` */
  static readonly CreateCoursePath = '/api/v1/courses';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `createCourse()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  createCourse$Response(params: CreateCourse$Params, context?: HttpContext): Observable<StrictHttpResponse<CourseDto>> {
    return createCourse(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `createCourse$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  createCourse(params: CreateCourse$Params, context?: HttpContext): Observable<CourseDto> {
    return this.createCourse$Response(params, context).pipe(
      map((r: StrictHttpResponse<CourseDto>): CourseDto => r.body)
    );
  }

  /** Path part for operation `getAutocompleteTitle()` */
  static readonly GetAutocompleteTitlePath = '/api/v1/courses/autocomplete';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getAutocompleteTitle()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAutocompleteTitle$Response(params: GetAutocompleteTitle$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<string>>> {
    return getAutocompleteTitle(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getAutocompleteTitle$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAutocompleteTitle(params: GetAutocompleteTitle$Params, context?: HttpContext): Observable<Array<string>> {
    return this.getAutocompleteTitle$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<string>>): Array<string> => r.body)
    );
  }

}
