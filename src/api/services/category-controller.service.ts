/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { CategoryDto } from '../models/category-dto';
import { createCategory } from '../fn/category-controller/create-category';
import { CreateCategory$Params } from '../fn/category-controller/create-category';
import { deleteCategory } from '../fn/category-controller/delete-category';
import { DeleteCategory$Params } from '../fn/category-controller/delete-category';
import { getAllCategories } from '../fn/category-controller/get-all-categories';
import { GetAllCategories$Params } from '../fn/category-controller/get-all-categories';
import { getCategoryById } from '../fn/category-controller/get-category-by-id';
import { GetCategoryById$Params } from '../fn/category-controller/get-category-by-id';
import { updateCategory } from '../fn/category-controller/update-category';
import { UpdateCategory$Params } from '../fn/category-controller/update-category';

@Injectable({ providedIn: 'root' })
export class CategoryControllerService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `getCategoryById()` */
  static readonly GetCategoryByIdPath = '/api/v1/categories/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getCategoryById()` instead.
   *
   * This method doesn't expect any request body.
   */
  getCategoryById$Response(params: GetCategoryById$Params, context?: HttpContext): Observable<StrictHttpResponse<CategoryDto>> {
    return getCategoryById(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getCategoryById$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getCategoryById(params: GetCategoryById$Params, context?: HttpContext): Observable<CategoryDto> {
    return this.getCategoryById$Response(params, context).pipe(
      map((r: StrictHttpResponse<CategoryDto>): CategoryDto => r.body)
    );
  }

  /** Path part for operation `updateCategory()` */
  static readonly UpdateCategoryPath = '/api/v1/categories/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `updateCategory()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  updateCategory$Response(params: UpdateCategory$Params, context?: HttpContext): Observable<StrictHttpResponse<CategoryDto>> {
    return updateCategory(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `updateCategory$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  updateCategory(params: UpdateCategory$Params, context?: HttpContext): Observable<CategoryDto> {
    return this.updateCategory$Response(params, context).pipe(
      map((r: StrictHttpResponse<CategoryDto>): CategoryDto => r.body)
    );
  }

  /** Path part for operation `deleteCategory()` */
  static readonly DeleteCategoryPath = '/api/v1/categories/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `deleteCategory()` instead.
   *
   * This method doesn't expect any request body.
   */
  deleteCategory$Response(params: DeleteCategory$Params, context?: HttpContext): Observable<StrictHttpResponse<void>> {
    return deleteCategory(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `deleteCategory$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  deleteCategory(params: DeleteCategory$Params, context?: HttpContext): Observable<void> {
    return this.deleteCategory$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

  /** Path part for operation `getAllCategories()` */
  static readonly GetAllCategoriesPath = '/api/v1/categories';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getAllCategories()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAllCategories$Response(params?: GetAllCategories$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<CategoryDto>>> {
    return getAllCategories(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getAllCategories$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAllCategories(params?: GetAllCategories$Params, context?: HttpContext): Observable<Array<CategoryDto>> {
    return this.getAllCategories$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<CategoryDto>>): Array<CategoryDto> => r.body)
    );
  }

  /** Path part for operation `createCategory()` */
  static readonly CreateCategoryPath = '/api/v1/categories';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `createCategory()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  createCategory$Response(params: CreateCategory$Params, context?: HttpContext): Observable<StrictHttpResponse<CategoryDto>> {
    return createCategory(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `createCategory$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  createCategory(params: CreateCategory$Params, context?: HttpContext): Observable<CategoryDto> {
    return this.createCategory$Response(params, context).pipe(
      map((r: StrictHttpResponse<CategoryDto>): CategoryDto => r.body)
    );
  }

}
