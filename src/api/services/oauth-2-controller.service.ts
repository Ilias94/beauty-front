/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { login1 } from '../fn/oauth-2-controller/login-1';
import { Login1$Params } from '../fn/oauth-2-controller/login-1';

@Injectable({ providedIn: 'root' })
export class Oauth2ControllerService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `login1()` */
  static readonly Login1Path = '/api/oauth2/authorization';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `login1()` instead.
   *
   * This method doesn't expect any request body.
   */
  login1$Response(params?: Login1$Params, context?: HttpContext): Observable<StrictHttpResponse<void>> {
    return login1(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `login1$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  login1(params?: Login1$Params, context?: HttpContext): Observable<void> {
    return this.login1$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

}
