/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { geoLocation } from '../fn/geo-location-controller/geo-location';
import { GeoLocation$Params } from '../fn/geo-location-controller/geo-location';

@Injectable({ providedIn: 'root' })
export class GeoLocationControllerService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `geoLocation()` */
  static readonly GeoLocationPath = '/api/v1/geolocation';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `geoLocation()` instead.
   *
   * This method doesn't expect any request body.
   */
  geoLocation$Response(params?: GeoLocation$Params, context?: HttpContext): Observable<StrictHttpResponse<void>> {
    return geoLocation(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `geoLocation$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  geoLocation(params?: GeoLocation$Params, context?: HttpContext): Observable<void> {
    return this.geoLocation$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

}
