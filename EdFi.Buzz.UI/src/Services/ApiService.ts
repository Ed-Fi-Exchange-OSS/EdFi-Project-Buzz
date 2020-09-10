// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.
import StudentApiService from './StudentService';
import TeacherApiService from './TeacherService';
import SurveyAnalyticsApiService from './SurveyAnalyticsService';
import SectionApiService from './SectionService';
import AuthenticationService from './AuthenticationService';
import StudentNotesApiService from './StudentNotesService';
import SurveyService from './SurveyService';


export default class ApiService {

  /* eslint no-useless-constructor: "off"*/
  constructor(
    public authentication: AuthenticationService,
    public section: SectionApiService,
    public student: StudentApiService,
    public studentNotesApiService: StudentNotesApiService,
    public surveyAnalytics: SurveyAnalyticsApiService,
    public teacher: TeacherApiService,
    public survey: SurveyService
  ) { }

}
