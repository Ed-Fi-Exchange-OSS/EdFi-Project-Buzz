// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.


import DIContainer, { object, get } from 'rsdi';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { ApiService } from 'Services/ApiService';
import { AuthenticationService } from 'Services/AuthenticationService';
import { EnvironmentService } from 'Services/EnvironmentService';
import { TeacherApiService } from 'Services/TeacherService';


const apolloClient = new ApolloClient({
  uri: 'http://localhost:3000',
  cache: new InMemoryCache()
});


export default function configureDI() {
  const container = new DIContainer();
  container.addDefinitions({
    'EnvironmentService': object(EnvironmentService),
    'ApolloClient': apolloClient,
    'ApiService': object(ApiService).construct(
      get('AuthenticationService'),
      get('SectionApiService'),
      get('StudentApiService'),
      get('StudentNotesApiService'),
      get('SurveyAnalyticsApiService'),
      get('TeacherApiService'),
      get('SurveyService')
    ),
    'AuthenticationService': object(AuthenticationService).construct(
      get('TeacherApiService'),
      get('ApolloClient')
    ),
    'SectionApiService' : null,
    'StudentApiService' : null,
    'StudentNotesApiService': null,
    'SurveyAnalyticsApiService': null,
    'TeacherApiService': object(TeacherApiService).construct(

    ),
    'SurveyService': null


  });
  return container;
}
