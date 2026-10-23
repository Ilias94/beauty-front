/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { addCourseImages } from '../fn/course-image-controller/add-course-images';
import { AddCourseImages$Params } from '../fn/course-image-controller/add-course-images';
import { CourseImageDto } from '../models/course-image-dto';
import { deleteCourseImage } from '../fn/course-image-controller/delete-course-image';
import { DeleteCourseImage$Params } from '../fn/course-image-controller/delete-course-image';
import { getCourseImages } from '../fn/course-image-controller/get-course-images';
import { GetCourseImages$Params } from '../fn/course-image-controller/get-course-images';
import { reorderCourseImages } from '../fn/course-image-controller/reorder-course-images';
import { ReorderCourseImages$Params } from '../fn/course-image-controller/reorder-course-images';

@Injectable({ providedIn: 'root' })
export class CourseImageControllerService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `reorderCourseImages()` */
  static readonly ReorderCourseImagesPath = '/api/v1/courses/{courseId}/images/order';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `reorderCourseImages()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  reorderCourseImages$Response(params: ReorderCourseImages$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<CourseImageDto>>> {
    return reorderCourseImages(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `reorderCourseImages$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  reorderCourseImages(params: ReorderCourseImages$Params, context?: HttpContext): Observable<Array<CourseImageDto>> {
    return this.reorderCourseImages$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<CourseImageDto>>): Array<CourseImageDto> => r.body)
    );
  }

  /** Path part for operation `getCourseImages()` */
  static readonly GetCourseImagesPath = '/api/v1/courses/{courseId}/images';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getCourseImages()` instead.
   *
   * This method doesn't expect any request body.
   */
  getCourseImages$Response(params: GetCourseImages$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<CourseImageDto>>> {
    return getCourseImages(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getCourseImages$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getCourseImages(params: GetCourseImages$Params, context?: HttpContext): Observable<Array<CourseImageDto>> {
    return this.getCourseImages$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<CourseImageDto>>): Array<CourseImageDto> => r.body)
    );
  }

  /** Path part for operation `addCourseImages()` */
  static readonly AddCourseImagesPath = '/api/v1/courses/{courseId}/images';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `addCourseImages()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  addCourseImages$Response(params: AddCourseImages$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<CourseImageDto>>> {
    return addCourseImages(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `addCourseImages$Response()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  addCourseImages(params: AddCourseImages$Params, context?: HttpContext): Observable<Array<CourseImageDto>> {
    return this.addCourseImages$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<CourseImageDto>>): Array<CourseImageDto> => r.body)
    );
  }

  /** Path part for operation `deleteCourseImage()` */
  static readonly DeleteCourseImagePath = '/api/v1/courses/{courseId}/images/{imageId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `deleteCourseImage()` instead.
   *
   * This method doesn't expect any request body.
   */
  deleteCourseImage$Response(params: DeleteCourseImage$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<CourseImageDto>>> {
    return deleteCourseImage(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `deleteCourseImage$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  deleteCourseImage(params: DeleteCourseImage$Params, context?: HttpContext): Observable<Array<CourseImageDto>> {
    return this.deleteCourseImage$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<CourseImageDto>>): Array<CourseImageDto> => r.body)
    );
  }

}
