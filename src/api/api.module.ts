/* tslint:disable */
/* eslint-disable */
import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConfiguration, ApiConfigurationParams } from './api-configuration';

import { UserControllerService } from './services/user-controller.service';
import { CourseControllerService } from './services/course-controller.service';
import { CategoryControllerService } from './services/category-controller.service';
import { TemplateControllerService } from './services/template-controller.service';
import { VideoControllerService } from './services/video-controller.service';
import { RatingControllerService } from './services/rating-controller.service';
import { PaymentControllerService } from './services/payment-controller.service';
import { LoginControllerService } from './services/login-controller.service';
import { GeoLocationControllerService } from './services/geo-location-controller.service';
import { CommentControllerService } from './services/comment-controller.service';
import { AiControllerService } from './services/ai-controller.service';
import { ReportControllerService } from './services/report-controller.service';
import { ParticipantsControllerService } from './services/participants-controller.service';
import { Oauth2ControllerService } from './services/oauth-2-controller.service';

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
    VideoControllerService,
    RatingControllerService,
    PaymentControllerService,
    LoginControllerService,
    GeoLocationControllerService,
    CommentControllerService,
    AiControllerService,
    ReportControllerService,
    ParticipantsControllerService,
    Oauth2ControllerService,
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
