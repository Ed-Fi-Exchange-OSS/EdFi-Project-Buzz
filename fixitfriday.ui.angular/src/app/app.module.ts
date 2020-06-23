import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { AppComponent } from './app.component';
import { HomeComponent } from './Features/home/home.component';
import { StudentCardComponent } from './Components/StudentCard/studentCard.component';
import { TeacherLandingComponent } from './Features/Landings/TeacherLanding/teacherLanding.component';
import { NavbarComponent } from './Features/navbar/navbar.component';
import { hasLifecycleHook } from '@angular/compiler/src/lifecycle_reflector';
import { GuardianCardComponent } from './Components/GuardianCard/guardianCard.component';
import { StudentCardLiteComponent } from './Components/StudentCardLite/studentCardLite.component';
import { SiblingCardComponent } from './Components/SiblingCard/siblingCard.component';
import { SurveyCardComponent } from './Components/SurveyCard/surveyCard.component';
import { StudentDetailComponent } from './Features/StudentDetail/studentDetail.component';
import { AuthServiceConfig, GoogleLoginProvider, SocialLoginModule } from 'angularx-social-login';
import { LoginComponent } from './Features/Login/login.component';
import { ChartsModule } from 'ng2-charts';
import { SurveyAnalytics2Component } from './Features/SurveyAnalytics2/surveyAnalytics2.component';
import { TooltipModule } from 'ng2-tooltip-directive';
import { SurveyAnalyticsCardComponent } from './Components/SurveyAnalyticsCard/surveyAnalyticsCard.component';

let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider("761615059487-5tuhthkic53s5m0e40k6n68hrc7i3udp.apps.googleusercontent.com")
  }
]);

export function provideConfig() {
  return config;
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
    SurveyAnalyticsCardComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    BrowserAnimationsModule,
    HttpClientModule,
    SocialLoginModule,
    FormsModule,
    ChartsModule,
    TooltipModule,
    RouterModule.forRoot([
      {
        path: 'app', component: HomeComponent, children: [ // this displays the navbar
          { path: '', component: TeacherLandingComponent },
          { path: 'studentDetail', component: StudentDetailComponent },
          { path: 'surveyAnalytics2', component: SurveyAnalytics2Component },
        ]
      },
      { path: 'login', component: LoginComponent },
      { path: '**', redirectTo: 'login' } // when security and auth guards applied change it to redirect to '' then auth guard login will redirect to login if necessary.
    ], { useHash: true, scrollPositionRestoration: 'enabled' })
  ],
  providers: [
    { provide: AuthServiceConfig, useFactory: provideConfig },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
