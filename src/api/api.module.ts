/* tslint:disable */
/* eslint-disable */
import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConfiguration, ApiConfigurationParams } from './api-configuration';

import { UserControllerService } from './services/user-controller.service';
import { CourseControllerService } from './services/course-controller.service';
import { CategoryControllerService } from './services/category-controller.service';
import { TemplateControllerService } from './services/template-controller.service';
import { RatingControllerService } from './services/rating-controller.service';
import { LoginControllerService } from './services/login-controller.service';
import { CommentControllerService } from './services/comment-controller.service';

/**
 * Module that provides all services and configuration.
 */
@NgModule({
  imports: [],
  exports: [],
  declarations: [],
  providers: [
    UserControllerService,
    CourseControllerService,
    CategoryControllerService,
    TemplateControllerService,
    RatingControllerService,
    LoginControllerService,
    CommentControllerService,
    ApiConfiguration
  ],
})
export class ApiModule {
  static forRoot(params: ApiConfigurationParams): ModuleWithProviders<ApiModule> {
    return {
      ngModule: ApiModule,
      providers: [
        {
          provide: ApiConfiguration,
          useValue: params
        }
      ]
    }
  }

  constructor( 
    @Optional() @SkipSelf() parentModule: ApiModule,
    @Optional() http: HttpClient
  ) {
    if (parentModule) {
      throw new Error('ApiModule is already loaded. Import in your base AppModule only.');
    }
    if (!http) {
      throw new Error('You need to import the HttpClientModule in your AppModule! \n' +
      'See also https://github.com/angular/angular/issues/20575');
    }
  }
}
