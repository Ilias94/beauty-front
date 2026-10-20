/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { ContactDtoResponse } from '../models/contact-dto-response';
import { ConversationDtoResponse } from '../models/conversation-dto-response';
import { getContacts } from '../fn/message-controller/get-contacts';
import { GetContacts$Params } from '../fn/message-controller/get-contacts';
import { getConversations } from '../fn/message-controller/get-conversations';
import { GetConversations$Params } from '../fn/message-controller/get-conversations';
import { getMessages } from '../fn/message-controller/get-messages';
import { GetMessages$Params } from '../fn/message-controller/get-messages';
import { markAsRead } from '../fn/message-controller/mark-as-read';
import { MarkAsRead$Params } from '../fn/message-controller/mark-as-read';
import { MessageDtoResponse } from '../models/message-dto-response';
import { send } from '../fn/message-controller/send';
import { Send$Params } from '../fn/message-controller/send';

@Injectable({ providedIn: 'root' })
export class MessageControllerService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `send()` */
  static readonly SendPath = '/api/v1/messages';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `send()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  send$Response(params: Send$Params, context?: HttpContext): Observable<StrictHttpResponse<MessageDtoResponse>> {
    return send(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `send$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  send(params: Send$Params, context?: HttpContext): Observable<MessageDtoResponse> {
    return this.send$Response(params, context).pipe(
      map((r: StrictHttpResponse<MessageDtoResponse>): MessageDtoResponse => r.body)
    );
  }

  /** Path part for operation `markAsRead()` */
  static readonly MarkAsReadPath = '/api/v1/messages/{partnerId}/read';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `markAsRead()` instead.
   *
   * This method doesn't expect any request body.
   */
  markAsRead$Response(params: MarkAsRead$Params, context?: HttpContext): Observable<StrictHttpResponse<void>> {
    return markAsRead(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `markAsRead$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  markAsRead(params: MarkAsRead$Params, context?: HttpContext): Observable<void> {
    return this.markAsRead$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

  /** Path part for operation `getMessages()` */
  static readonly GetMessagesPath = '/api/v1/messages/{partnerId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getMessages()` instead.
   *
   * This method doesn't expect any request body.
   */
  getMessages$Response(params: GetMessages$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<MessageDtoResponse>>> {
    return getMessages(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getMessages$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getMessages(params: GetMessages$Params, context?: HttpContext): Observable<Array<MessageDtoResponse>> {
    return this.getMessages$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<MessageDtoResponse>>): Array<MessageDtoResponse> => r.body)
    );
  }

  /** Path part for operation `getConversations()` */
  static readonly GetConversationsPath = '/api/v1/messages/conversations';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getConversations()` instead.
   *
   * This method doesn't expect any request body.
   */
  getConversations$Response(params?: GetConversations$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<ConversationDtoResponse>>> {
    return getConversations(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getConversations$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getConversations(params?: GetConversations$Params, context?: HttpContext): Observable<Array<ConversationDtoResponse>> {
    return this.getConversations$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<ConversationDtoResponse>>): Array<ConversationDtoResponse> => r.body)
    );
  }

  /** Path part for operation `getContacts()` */
  static readonly GetContactsPath = '/api/v1/messages/contacts';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getContacts()` instead.
   *
   * This method doesn't expect any request body.
   */
  getContacts$Response(params?: GetContacts$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<ContactDtoResponse>>> {
    return getContacts(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getContacts$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getContacts(params?: GetContacts$Params, context?: HttpContext): Observable<Array<ContactDtoResponse>> {
    return this.getContacts$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<ContactDtoResponse>>): Array<ContactDtoResponse> => r.body)
    );
  }

}
