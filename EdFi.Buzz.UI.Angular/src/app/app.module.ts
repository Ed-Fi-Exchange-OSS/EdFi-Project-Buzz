// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { AuthServiceConfig, GoogleLoginProvider, SocialLoginModule, AuthService } from 'angularx-social-login';
import { ChartsModule } from 'ng2-charts';

import { AppComponent } from './app.component';
import { HomeComponent } from './Features/home/home.component';
import { NavbarComponent } from './Features/navbar/navbar.component';
import { GuardianCardComponent } from './Components/GuardianCard/guardianCard.component';
import { StudentCardLiteComponent } from './Components/StudentCardLite/studentCardLite.component';
import { SiblingCardComponent } from './Components/SiblingCard/siblingCard.component';
import { SurveyCardComponent } from './Components/SurveyCard/surveyCard.component';
import { StudentDetailComponent } from './Features/StudentDetail/studentDetail.component';
import { JwtInterceptor } from './Interceptors/jwt.interceptor';
import { AuthGuard } from './Interceptors/auth.guard';
import { EnvironmentService } from './Services/environment.service';
import { UploadSurveyWrapperComponent } from './Features/UploadSurvey/uploadSurveyWrapperComponent';
import { DndDirective } from './Directives/dnd.directive';
import { SortAnswersByPipe } from './Helpers/sortAnswersBy.pipe';
import { TeacherLandingReactWrapperComponent } from './Features/Landings/TeacherLandingReact/teacherLandingReactWrapper';
import { SurveyAnalyticsReactWrapperComponent } from './Features/SurveyAnalyticsReact/surveyAnalyticsReactWrapper';
import { LoginReactWrapperComponent } from './Features/LoginReact/LoginReactWrapper';
import { AdminSurveyReactWrapperComponent } from './AdminSurveyReact/adminSurveyWrapper';

export function provideApolloConfig({ environment }: EnvironmentService, httpLink: HttpLink) {
  return {
    cache: new InMemoryCache(),
    link: httpLink.create({
      uri: environment.GQL_ENDPOINT
    })
  };
}

export function provideAuthServiceConfig({ environment }: EnvironmentService) {
  return new AuthServiceConfig([
    {
      id: GoogleLoginProvider.PROVIDER_ID,
      provider: new GoogleLoginProvider(environment.GOOGLE_CLIENT_ID)
    }
  ]);
}

export function provideAuthService(config: AuthServiceConfig, { environment }: EnvironmentService) {
  if (!Boolean(environment.GOOGLE_CLIENT_ID)) {
    return null;
  }
  return new AuthService(config);
}


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    StudentCardLiteComponent,
    GuardianCardComponent,
    SiblingCardComponent,
    SurveyCardComponent,
    StudentDetailComponent,
    LoginReactWrapperComponent,
    DndDirective,
    SortAnswersByPipe,
    TeacherLandingReactWrapperComponent,
    SurveyAnalyticsReactWrapperComponent,
    UploadSurveyWrapperComponent,
    AdminSurveyReactWrapperComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    BrowserAnimationsModule,
    HttpClientModule,
    SocialLoginModule,
    ApolloModule,
    HttpLinkModule,
    FormsModule,
    ChartsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      {
        path: 'app', component: HomeComponent, children: [ // this displays the navbar
          { path: '', component: TeacherLandingReactWrapperComponent },
          { path: 'studentDetail/:id', component: StudentDetailComponent },
          { path: 'surveyAnalytics', component: SurveyAnalyticsReactWrapperComponent },
          { path: 'uploadSurvey', component: UploadSurveyWrapperComponent, data: { roles: ['surveyUploader'] } },
          { path: 'uploadSurvey/:id', component: UploadSurveyWrapperComponent, data: { roles: ['surveyUploader'] } },
          { path: 'adminSurvey', component: AdminSurveyComponent, data: { roles: ['surveyUploader'] } },
          { path: 'adminSurvey', component: AdminSurveyReactWrapperComponent, data: { roles: ['surveyUploader'] } },
        ],
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard]
      },
      { path: 'login', component: LoginReactWrapperComponent },
      // when security and auth guards applied change it to redirect to '' then auth guard login will redirect to login if necessary.
      { path: '**', redirectTo: 'app' }
    ], { useHash: true, scrollPositionRestoration: 'enabled' })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: AuthService, useFactory: provideAuthService, deps: [AuthServiceConfig, EnvironmentService] },
    { provide: AuthServiceConfig, useFactory: provideAuthServiceConfig, deps: [EnvironmentService] },
    { provide: APOLLO_OPTIONS, useFactory: provideApolloConfig, deps: [EnvironmentService, HttpLink] },
    Title
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
