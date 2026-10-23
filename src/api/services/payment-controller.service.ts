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
import { getPaymentStatus } from '../fn/payment-controller/get-payment-status';
import { GetPaymentStatus$Params } from '../fn/payment-controller/get-payment-status';
import { PaymentStatusDtoResponse } from '../models/payment-status-dto-response';

@Injectable({ providedIn: 'root' })
export class PaymentControllerService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
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

  /** Path part for operation `getPaymentStatus()` */
  static readonly GetPaymentStatusPath = '/api/v1/payment/{orderId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getPaymentStatus()` instead.
   *
   * This method doesn't expect any request body.
   */
  getPaymentStatus$Response(params: GetPaymentStatus$Params, context?: HttpContext): Observable<StrictHttpResponse<PaymentStatusDtoResponse>> {
    return getPaymentStatus(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getPaymentStatus$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getPaymentStatus(params: GetPaymentStatus$Params, context?: HttpContext): Observable<PaymentStatusDtoResponse> {
    return this.getPaymentStatus$Response(params, context).pipe(
      map((r: StrictHttpResponse<PaymentStatusDtoResponse>): PaymentStatusDtoResponse => r.body)
    );
  }

}
