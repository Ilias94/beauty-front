/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { ConnectLinkDtoResponse } from '../models/connect-link-dto-response';
import { ConnectStatusDtoResponse } from '../models/connect-status-dto-response';
import { createStripeDashboardLink } from '../fn/connect-controller/create-stripe-dashboard-link';
import { CreateStripeDashboardLink$Params } from '../fn/connect-controller/create-stripe-dashboard-link';
import { getStripeConnectStatus } from '../fn/connect-controller/get-stripe-connect-status';
import { GetStripeConnectStatus$Params } from '../fn/connect-controller/get-stripe-connect-status';
import { startStripeOnboarding } from '../fn/connect-controller/start-stripe-onboarding';
import { StartStripeOnboarding$Params } from '../fn/connect-controller/start-stripe-onboarding';

@Injectable({ providedIn: 'root' })
export class ConnectControllerService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `startStripeOnboarding()` */
  static readonly StartStripeOnboardingPath = '/api/v1/connect/onboarding';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `startStripeOnboarding()` instead.
   *
   * This method doesn't expect any request body.
   */
  startStripeOnboarding$Response(params?: StartStripeOnboarding$Params, context?: HttpContext): Observable<StrictHttpResponse<ConnectLinkDtoResponse>> {
    return startStripeOnboarding(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `startStripeOnboarding$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  startStripeOnboarding(params?: StartStripeOnboarding$Params, context?: HttpContext): Observable<ConnectLinkDtoResponse> {
    return this.startStripeOnboarding$Response(params, context).pipe(
      map((r: StrictHttpResponse<ConnectLinkDtoResponse>): ConnectLinkDtoResponse => r.body)
    );
  }

  /** Path part for operation `createStripeDashboardLink()` */
  static readonly CreateStripeDashboardLinkPath = '/api/v1/connect/dashboard-link';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `createStripeDashboardLink()` instead.
   *
   * This method doesn't expect any request body.
   */
  createStripeDashboardLink$Response(params?: CreateStripeDashboardLink$Params, context?: HttpContext): Observable<StrictHttpResponse<ConnectLinkDtoResponse>> {
    return createStripeDashboardLink(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `createStripeDashboardLink$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  createStripeDashboardLink(params?: CreateStripeDashboardLink$Params, context?: HttpContext): Observable<ConnectLinkDtoResponse> {
    return this.createStripeDashboardLink$Response(params, context).pipe(
      map((r: StrictHttpResponse<ConnectLinkDtoResponse>): ConnectLinkDtoResponse => r.body)
    );
  }

  /** Path part for operation `getStripeConnectStatus()` */
  static readonly GetStripeConnectStatusPath = '/api/v1/connect/status';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getStripeConnectStatus()` instead.
   *
   * This method doesn't expect any request body.
   */
  getStripeConnectStatus$Response(params?: GetStripeConnectStatus$Params, context?: HttpContext): Observable<StrictHttpResponse<ConnectStatusDtoResponse>> {
    return getStripeConnectStatus(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getStripeConnectStatus$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getStripeConnectStatus(params?: GetStripeConnectStatus$Params, context?: HttpContext): Observable<ConnectStatusDtoResponse> {
    return this.getStripeConnectStatus$Response(params, context).pipe(
      map((r: StrictHttpResponse<ConnectStatusDtoResponse>): ConnectStatusDtoResponse => r.body)
    );
  }

}
