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
import { AuthServiceConfig, GoogleLoginProvider, SocialLoginModule } from 'angularx-social-login';
import { ChartsModule } from 'ng2-charts';

import { AppComponent } from './app.component';
import { HomeComponent } from './Features/home/home.component';
import { StudentCardComponent } from './Components/StudentCard/studentCard.component';
import { TeacherLandingComponent } from './Features/Landings/TeacherLanding/teacherLanding.component';
import { NavbarComponent } from './Features/navbar/navbar.component';
import { GuardianCardComponent } from './Components/GuardianCard/guardianCard.component';
import { StudentCardLiteComponent } from './Components/StudentCardLite/studentCardLite.component';
import { SiblingCardComponent } from './Components/SiblingCard/siblingCard.component';
import { SurveyCardComponent } from './Components/SurveyCard/surveyCard.component';
import { StudentDetailComponent } from './Features/StudentDetail/studentDetail.component';
import { LoginComponent } from './Features/Login/login.component';
import { SurveyAnalytics2Component } from './Features/SurveyAnalytics2/surveyAnalytics2.component';
import { JwtInterceptor } from './Interceptors/jwt.interceptor';
import { AuthGuard } from './Interceptors/auth.guard';
import { EnvironmentService } from './Services/environment.service';
import { UploadSurveyComponent } from './Features/UploadSurvey/uploadSurvey.component';
import { DndDirective } from './Directives/dnd.directive';
import { SortAnswersByPipe } from './Helpers/sortAnswersBy.pipe';

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

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TeacherLandingComponent,
    NavbarComponent,
    StudentCardComponent,
    StudentCardLiteComponent,
    GuardianCardComponent,
    SiblingCardComponent,
    SurveyCardComponent,
    StudentDetailComponent,
    SurveyAnalytics2Component,
    UploadSurveyComponent,
    LoginComponent,
    DndDirective,
    SortAnswersByPipe
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
          { path: '', component: TeacherLandingComponent },
          { path: 'studentDetail/:id', component: StudentDetailComponent },
          { path: 'surveyAnalytics2', component: SurveyAnalytics2Component },
          { path: 'uploadSurvey', component: UploadSurveyComponent, data: { roles: ['surveyUploader'] } },
        ],
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard]
      },
      { path: 'login', component: LoginComponent },
      // when security and auth guards applied change it to redirect to '' then auth guard login will redirect to login if necessary.
      { path: '**', redirectTo: 'app' }
    ], { useHash: true, scrollPositionRestoration: 'enabled' })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: AuthServiceConfig, useFactory: provideAuthServiceConfig, deps: [EnvironmentService] },
    { provide: APOLLO_OPTIONS, useFactory: provideApolloConfig, deps: [EnvironmentService, HttpLink] },
    Title
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
