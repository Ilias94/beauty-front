/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { addReply } from '../fn/ticket-controller/add-reply';
import { AddReply$Params } from '../fn/ticket-controller/add-reply';
import { createTicket } from '../fn/ticket-controller/create-ticket';
import { CreateTicket$Params } from '../fn/ticket-controller/create-ticket';
import { getAllTickets } from '../fn/ticket-controller/get-all-tickets';
import { GetAllTickets$Params } from '../fn/ticket-controller/get-all-tickets';
import { getById } from '../fn/ticket-controller/get-by-id';
import { GetById$Params } from '../fn/ticket-controller/get-by-id';
import { getMyTickets } from '../fn/ticket-controller/get-my-tickets';
import { GetMyTickets$Params } from '../fn/ticket-controller/get-my-tickets';
import { resolveTicket } from '../fn/ticket-controller/resolve-ticket';
import { ResolveTicket$Params } from '../fn/ticket-controller/resolve-ticket';
import { TicketDto } from '../models/ticket-dto';
import { updateStatus } from '../fn/ticket-controller/update-status';
import { UpdateStatus$Params } from '../fn/ticket-controller/update-status';

@Injectable({ providedIn: 'root' })
export class TicketControllerService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `getAllTickets()` */
  static readonly GetAllTicketsPath = '/api/v1/tickets';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getAllTickets()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAllTickets$Response(params?: GetAllTickets$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<TicketDto>>> {
    return getAllTickets(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getAllTickets$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAllTickets(params?: GetAllTickets$Params, context?: HttpContext): Observable<Array<TicketDto>> {
    return this.getAllTickets$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<TicketDto>>): Array<TicketDto> => r.body)
    );
  }

  /** Path part for operation `createTicket()` */
  static readonly CreateTicketPath = '/api/v1/tickets';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `createTicket()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  createTicket$Response(params: CreateTicket$Params, context?: HttpContext): Observable<StrictHttpResponse<TicketDto>> {
    return createTicket(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `createTicket$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  createTicket(params: CreateTicket$Params, context?: HttpContext): Observable<TicketDto> {
    return this.createTicket$Response(params, context).pipe(
      map((r: StrictHttpResponse<TicketDto>): TicketDto => r.body)
    );
  }

  /** Path part for operation `resolveTicket()` */
  static readonly ResolveTicketPath = '/api/v1/tickets/{id}/resolve';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `resolveTicket()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  resolveTicket$Response(params: ResolveTicket$Params, context?: HttpContext): Observable<StrictHttpResponse<TicketDto>> {
    return resolveTicket(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `resolveTicket$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  resolveTicket(params: ResolveTicket$Params, context?: HttpContext): Observable<TicketDto> {
    return this.resolveTicket$Response(params, context).pipe(
      map((r: StrictHttpResponse<TicketDto>): TicketDto => r.body)
    );
  }

  /** Path part for operation `addReply()` */
  static readonly AddReplyPath = '/api/v1/tickets/{id}/replies';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `addReply()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  addReply$Response(params: AddReply$Params, context?: HttpContext): Observable<StrictHttpResponse<TicketDto>> {
    return addReply(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `addReply$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  addReply(params: AddReply$Params, context?: HttpContext): Observable<TicketDto> {
    return this.addReply$Response(params, context).pipe(
      map((r: StrictHttpResponse<TicketDto>): TicketDto => r.body)
    );
  }

  /** Path part for operation `updateStatus()` */
  static readonly UpdateStatusPath = '/api/v1/tickets/{id}/status';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `updateStatus()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  updateStatus$Response(params: UpdateStatus$Params, context?: HttpContext): Observable<StrictHttpResponse<TicketDto>> {
    return updateStatus(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `updateStatus$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  updateStatus(params: UpdateStatus$Params, context?: HttpContext): Observable<TicketDto> {
    return this.updateStatus$Response(params, context).pipe(
      map((r: StrictHttpResponse<TicketDto>): TicketDto => r.body)
    );
  }

  /** Path part for operation `getById()` */
  static readonly GetByIdPath = '/api/v1/tickets/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getById()` instead.
   *
   * This method doesn't expect any request body.
   */
  getById$Response(params: GetById$Params, context?: HttpContext): Observable<StrictHttpResponse<TicketDto>> {
    return getById(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getById$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getById(params: GetById$Params, context?: HttpContext): Observable<TicketDto> {
    return this.getById$Response(params, context).pipe(
      map((r: StrictHttpResponse<TicketDto>): TicketDto => r.body)
    );
  }

  /** Path part for operation `getMyTickets()` */
  static readonly GetMyTicketsPath = '/api/v1/tickets/my';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getMyTickets()` instead.
   *
   * This method doesn't expect any request body.
   */
  getMyTickets$Response(params?: GetMyTickets$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<TicketDto>>> {
    return getMyTickets(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getMyTickets$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getMyTickets(params?: GetMyTickets$Params, context?: HttpContext): Observable<Array<TicketDto>> {
    return this.getMyTickets$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<TicketDto>>): Array<TicketDto> => r.body)
    );
  }

}
