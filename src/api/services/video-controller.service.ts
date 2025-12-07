/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { deleteVideo } from '../fn/video-controller/delete-video';
import { DeleteVideo$Params } from '../fn/video-controller/delete-video';
import { editDescription } from '../fn/video-controller/edit-description';
import { EditDescription$Params } from '../fn/video-controller/edit-description';
import { getVideos } from '../fn/video-controller/get-videos';
import { GetVideos$Params } from '../fn/video-controller/get-videos';
import { uploadVideos } from '../fn/video-controller/upload-videos';
import { UploadVideos$Params } from '../fn/video-controller/upload-videos';
import { VideoDtoResponse } from '../models/video-dto-response';

@Injectable({ providedIn: 'root' })
export class VideoControllerService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `uploadVideos()` */
  static readonly UploadVideosPath = '/api/v1/video/upload/{courseId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `uploadVideos()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  uploadVideos$Response(params: UploadVideos$Params, context?: HttpContext): Observable<StrictHttpResponse<void>> {
    return uploadVideos(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `uploadVideos$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  uploadVideos(params: UploadVideos$Params, context?: HttpContext): Observable<void> {
    return this.uploadVideos$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

  /** Path part for operation `editDescription()` */
  static readonly EditDescriptionPath = '/api/v1/video/description';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `editDescription()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  editDescription$Response(params: EditDescription$Params, context?: HttpContext): Observable<StrictHttpResponse<void>> {
    return editDescription(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `editDescription$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  editDescription(params: EditDescription$Params, context?: HttpContext): Observable<void> {
    return this.editDescription$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

  /** Path part for operation `getVideos()` */
  static readonly GetVideosPath = '/api/v1/video/{courseId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getVideos()` instead.
   *
   * This method doesn't expect any request body.
   */
  getVideos$Response(params: GetVideos$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<VideoDtoResponse>>> {
    return getVideos(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getVideos$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getVideos(params: GetVideos$Params, context?: HttpContext): Observable<Array<VideoDtoResponse>> {
    return this.getVideos$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<VideoDtoResponse>>): Array<VideoDtoResponse> => r.body)
    );
  }

  /** Path part for operation `deleteVideo()` */
  static readonly DeleteVideoPath = '/api/v1/video/{videoId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `deleteVideo()` instead.
   *
   * This method doesn't expect any request body.
   */
  deleteVideo$Response(params: DeleteVideo$Params, context?: HttpContext): Observable<StrictHttpResponse<void>> {
    return deleteVideo(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `deleteVideo$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  deleteVideo(params: DeleteVideo$Params, context?: HttpContext): Observable<void> {
    return this.deleteVideo$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

}
