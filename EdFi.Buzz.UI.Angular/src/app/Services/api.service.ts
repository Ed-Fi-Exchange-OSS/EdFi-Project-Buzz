// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Injectable } from '@angular/core';
// import { OAuthApiService } from './o-auth-api.service';
import { StudentApiService } from './student.service';
import { TeacherApiService } from './teacher.service';
import { SurveyAnalyticsApiService } from './surveyAnalytics.service';
import { SectionApiService } from './section.service';
import { AuthenticationService } from './authentication.service';
import { StudentNotesApiService } from './studentNotes.service';
import { SurveyService } from './survey.service';


@Injectable({ providedIn: 'root' })
export class ApiService {

  constructor(
    // public oauth: OAuthApiService,
    public authentication: AuthenticationService,
    public section: SectionApiService,
    public student: StudentApiService,
    public studentNotesApiService: StudentNotesApiService,
    public surveyAnalytics: SurveyAnalyticsApiService,
    public teacher: TeacherApiService,
    public survey: SurveyService
  ) { }

}
