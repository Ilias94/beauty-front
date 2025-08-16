/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { createPayment } from '../fn/payment-controller/create-payment';
import { CreatePayment$Params } from '../fn/payment-controller/create-payment';
import { CreatePaymentDtoResponse } from '../models/create-payment-dto-response';
import { getPayment } from '../fn/payment-controller/get-payment';
import { GetPayment$Params } from '../fn/payment-controller/get-payment';
import { notify } from '../fn/payment-controller/notify';
import { Notify$Params } from '../fn/payment-controller/notify';

@Injectable({ providedIn: 'root' })
export class PaymentControllerService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `getPayment()` */
  static readonly GetPaymentPath = '/api/v1/payment';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getPayment()` instead.
   *
   * This method doesn't expect any request body.
   */
  getPayment$Response(params?: GetPayment$Params, context?: HttpContext): Observable<StrictHttpResponse<string>> {
    return getPayment(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getPayment$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getPayment(params?: GetPayment$Params, context?: HttpContext): Observable<string> {
    return this.getPayment$Response(params, context).pipe(
      map((r: StrictHttpResponse<string>): string => r.body)
    );
  }

  /** Path part for operation `createPayment()` */
  static readonly CreatePaymentPath = '/api/v1/payment';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `createPayment()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  createPayment$Response(params: CreatePayment$Params, context?: HttpContext): Observable<StrictHttpResponse<CreatePaymentDtoResponse>> {
    return createPayment(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `createPayment$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  createPayment(params: CreatePayment$Params, context?: HttpContext): Observable<CreatePaymentDtoResponse> {
    return this.createPayment$Response(params, context).pipe(
      map((r: StrictHttpResponse<CreatePaymentDtoResponse>): CreatePaymentDtoResponse => r.body)
    );
  }

  /** Path part for operation `notify()` */
  static readonly NotifyPath = '/api/v1/payment/notify';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `notify()` instead.
   *
   * This method doesn't expect any request body.
   */
  notify$Response(params: Notify$Params, context?: HttpContext): Observable<StrictHttpResponse<{
}>> {
    return notify(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `notify$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  notify(params: Notify$Params, context?: HttpContext): Observable<{
}> {
    return this.notify$Response(params, context).pipe(
      map((r: StrictHttpResponse<{
}>): {
} => r.body)
    );
  }

}
