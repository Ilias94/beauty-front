/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { createTemplate } from '../fn/template-controller/create-template';
import { CreateTemplate$Params } from '../fn/template-controller/create-template';
import { deleteTemplate } from '../fn/template-controller/delete-template';
import { DeleteTemplate$Params } from '../fn/template-controller/delete-template';
import { getAllTemplates } from '../fn/template-controller/get-all-templates';
import { GetAllTemplates$Params } from '../fn/template-controller/get-all-templates';
import { getTemplateById } from '../fn/template-controller/get-template-by-id';
import { GetTemplateById$Params } from '../fn/template-controller/get-template-by-id';
import { TemplateDto } from '../models/template-dto';
import { updateTemplate } from '../fn/template-controller/update-template';
import { UpdateTemplate$Params } from '../fn/template-controller/update-template';

@Injectable({ providedIn: 'root' })
export class TemplateControllerService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `getTemplateById()` */
  static readonly GetTemplateByIdPath = '/api/templates/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getTemplateById()` instead.
   *
   * This method doesn't expect any request body.
   */
  getTemplateById$Response(params: GetTemplateById$Params, context?: HttpContext): Observable<StrictHttpResponse<TemplateDto>> {
    return getTemplateById(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getTemplateById$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getTemplateById(params: GetTemplateById$Params, context?: HttpContext): Observable<TemplateDto> {
    return this.getTemplateById$Response(params, context).pipe(
      map((r: StrictHttpResponse<TemplateDto>): TemplateDto => r.body)
    );
  }

  /** Path part for operation `updateTemplate()` */
  static readonly UpdateTemplatePath = '/api/templates/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `updateTemplate()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  updateTemplate$Response(params: UpdateTemplate$Params, context?: HttpContext): Observable<StrictHttpResponse<TemplateDto>> {
    return updateTemplate(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `updateTemplate$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  updateTemplate(params: UpdateTemplate$Params, context?: HttpContext): Observable<TemplateDto> {
    return this.updateTemplate$Response(params, context).pipe(
      map((r: StrictHttpResponse<TemplateDto>): TemplateDto => r.body)
    );
  }

  /** Path part for operation `deleteTemplate()` */
  static readonly DeleteTemplatePath = '/api/templates/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `deleteTemplate()` instead.
   *
   * This method doesn't expect any request body.
   */
  deleteTemplate$Response(params: DeleteTemplate$Params, context?: HttpContext): Observable<StrictHttpResponse<void>> {
    return deleteTemplate(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `deleteTemplate$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  deleteTemplate(params: DeleteTemplate$Params, context?: HttpContext): Observable<void> {
    return this.deleteTemplate$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

  /** Path part for operation `getAllTemplates()` */
  static readonly GetAllTemplatesPath = '/api/templates';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getAllTemplates()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAllTemplates$Response(params?: GetAllTemplates$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<TemplateDto>>> {
    return getAllTemplates(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getAllTemplates$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAllTemplates(params?: GetAllTemplates$Params, context?: HttpContext): Observable<Array<TemplateDto>> {
    return this.getAllTemplates$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<TemplateDto>>): Array<TemplateDto> => r.body)
    );
  }

  /** Path part for operation `createTemplate()` */
  static readonly CreateTemplatePath = '/api/templates';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `createTemplate()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  createTemplate$Response(params: CreateTemplate$Params, context?: HttpContext): Observable<StrictHttpResponse<TemplateDto>> {
    return createTemplate(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `createTemplate$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  createTemplate(params: CreateTemplate$Params, context?: HttpContext): Observable<TemplateDto> {
    return this.createTemplate$Response(params, context).pipe(
      map((r: StrictHttpResponse<TemplateDto>): TemplateDto => r.body)
    );
  }

}
