/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { changePassword } from '../fn/user-controller/change-password';
import { ChangePassword$Params } from '../fn/user-controller/change-password';
import { deleteUserById } from '../fn/user-controller/delete-user-by-id';
import { DeleteUserById$Params } from '../fn/user-controller/delete-user-by-id';
import { findUserById } from '../fn/user-controller/find-user-by-id';
import { FindUserById$Params } from '../fn/user-controller/find-user-by-id';
import { getCurrentLoginUser } from '../fn/user-controller/get-current-login-user';
import { GetCurrentLoginUser$Params } from '../fn/user-controller/get-current-login-user';
import { getUsers } from '../fn/user-controller/get-users';
import { GetUsers$Params } from '../fn/user-controller/get-users';
import { PageUserDtoResponse } from '../models/page-user-dto-response';
import { saveUser } from '../fn/user-controller/save-user';
import { SaveUser$Params } from '../fn/user-controller/save-user';
import { updateUser } from '../fn/user-controller/update-user';
import { UpdateUser$Params } from '../fn/user-controller/update-user';
import { UserDtoResponse } from '../models/user-dto-response';

@Injectable({ providedIn: 'root' })
export class UserControllerService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `findUserById()` */
  static readonly FindUserByIdPath = '/api/v1/users/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `findUserById()` instead.
   *
   * This method doesn't expect any request body.
   */
  findUserById$Response(params: FindUserById$Params, context?: HttpContext): Observable<StrictHttpResponse<UserDtoResponse>> {
    return findUserById(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `findUserById$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  findUserById(params: FindUserById$Params, context?: HttpContext): Observable<UserDtoResponse> {
    return this.findUserById$Response(params, context).pipe(
      map((r: StrictHttpResponse<UserDtoResponse>): UserDtoResponse => r.body)
    );
  }

  /** Path part for operation `updateUser()` */
  static readonly UpdateUserPath = '/api/v1/users/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `updateUser()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  updateUser$Response(params: UpdateUser$Params, context?: HttpContext): Observable<StrictHttpResponse<UserDtoResponse>> {
    return updateUser(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `updateUser$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  updateUser(params: UpdateUser$Params, context?: HttpContext): Observable<UserDtoResponse> {
    return this.updateUser$Response(params, context).pipe(
      map((r: StrictHttpResponse<UserDtoResponse>): UserDtoResponse => r.body)
    );
  }

  /** Path part for operation `deleteUserById()` */
  static readonly DeleteUserByIdPath = '/api/v1/users/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `deleteUserById()` instead.
   *
   * This method doesn't expect any request body.
   */
  deleteUserById$Response(params: DeleteUserById$Params, context?: HttpContext): Observable<StrictHttpResponse<void>> {
    return deleteUserById(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `deleteUserById$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  deleteUserById(params: DeleteUserById$Params, context?: HttpContext): Observable<void> {
    return this.deleteUserById$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

  /** Path part for operation `changePassword()` */
  static readonly ChangePasswordPath = '/api/v1/users/{id}/change-password';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `changePassword()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  changePassword$Response(params: ChangePassword$Params, context?: HttpContext): Observable<StrictHttpResponse<void>> {
    return changePassword(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `changePassword$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  changePassword(params: ChangePassword$Params, context?: HttpContext): Observable<void> {
    return this.changePassword$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

  /** Path part for operation `getUsers()` */
  static readonly GetUsersPath = '/api/v1/users';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getUsers()` instead.
   *
   * This method doesn't expect any request body.
   */
  getUsers$Response(params: GetUsers$Params, context?: HttpContext): Observable<StrictHttpResponse<PageUserDtoResponse>> {
    return getUsers(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getUsers$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getUsers(params: GetUsers$Params, context?: HttpContext): Observable<PageUserDtoResponse> {
    return this.getUsers$Response(params, context).pipe(
      map((r: StrictHttpResponse<PageUserDtoResponse>): PageUserDtoResponse => r.body)
    );
  }

  /** Path part for operation `saveUser()` */
  static readonly SaveUserPath = '/api/v1/users';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `saveUser()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  saveUser$Response(params?: SaveUser$Params, context?: HttpContext): Observable<StrictHttpResponse<UserDtoResponse>> {
    return saveUser(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `saveUser$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  saveUser(params?: SaveUser$Params, context?: HttpContext): Observable<UserDtoResponse> {
    return this.saveUser$Response(params, context).pipe(
      map((r: StrictHttpResponse<UserDtoResponse>): UserDtoResponse => r.body)
    );
  }

  /** Path part for operation `getCurrentLoginUser()` */
  static readonly GetCurrentLoginUserPath = '/api/v1/users/current';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getCurrentLoginUser()` instead.
   *
   * This method doesn't expect any request body.
   */
  getCurrentLoginUser$Response(params?: GetCurrentLoginUser$Params, context?: HttpContext): Observable<StrictHttpResponse<UserDtoResponse>> {
    return getCurrentLoginUser(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getCurrentLoginUser$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getCurrentLoginUser(params?: GetCurrentLoginUser$Params, context?: HttpContext): Observable<UserDtoResponse> {
    return this.getCurrentLoginUser$Response(params, context).pipe(
      map((r: StrictHttpResponse<UserDtoResponse>): UserDtoResponse => r.body)
    );
  }

}
