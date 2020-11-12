// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.


import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import DIContainer, { object, get } from 'rsdi';

import ApiService from 'Services/ApiService';
import AuthenticationService from 'Services/AuthenticationService';
import EnvironmentService from 'Services/EnvironmentService';
import SectionApiService from 'Services/SectionService';
import StudentNotesApiService from 'Services/StudentNotesService';
import StudentApiService from 'Services/StudentService';
import SurveyAnalyticsApiService from 'Services/SurveyAnalyticsService';
import SurveyService from 'Services/SurveyService';
import TeacherApiService from 'Services/TeacherService';
import OdsSurveyService from 'Services/OdsSurveyService';
import AttendanceApiService from 'Services/AttendanceService';
import typeDefs from './graphql/typeDefinitions';

function createApolloClient(container: DIContainer) {
  const env: EnvironmentService = container.get('EnvironmentService');
  const httpLink = createHttpLink({
    uri: env.environment.GQL_ENDPOINT,
    fetchOptions: {
      mode: 'cors'
    }
  });

  const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = sessionStorage.getItem('validatingToken');

    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : ''
      }
    };
  });

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    typeDefs
  });
}

export default function configureDI(): DIContainer {
  const container = new DIContainer();
  container.addDefinitions({
    'EnvironmentService': object(EnvironmentService).construct()
  });
  container.addDefinitions({
    'ApolloClient': createApolloClient(container),
    'ApiService': object(ApiService).construct(
      get('AuthenticationService'),
      get('SectionApiService'),
      get('StudentApiService'),
      get('StudentNotesApiService'),
      get('SurveyAnalyticsApiService'),
      get('TeacherApiService'),
      get('SurveyService'),
      get('OdsSurveyService'),
      get('AttendanceApiService')
    ),
    'AuthenticationService': object(AuthenticationService).construct(
      get('TeacherApiService'),
      get('ApolloClient'),
      get('EnvironmentService')
    ),
    'SectionApiService': object(SectionApiService).construct(
      get('AuthenticationService'),
      get('ApolloClient')
    ),
    'StudentApiService': object(StudentApiService).construct(
      get('AuthenticationService'),
      get('ApolloClient')
    ),
    'StudentNotesApiService': object(StudentNotesApiService).construct(
      get('ApolloClient')
    ),
    'SurveyAnalyticsApiService': object(SurveyAnalyticsApiService).construct(
      get('StudentApiService'),
      get('AuthenticationService'),
      get('ApolloClient')
    ),
    'TeacherApiService': object(TeacherApiService).construct(
      get('ApolloClient')
    ),
    'SurveyService': object(SurveyService).construct(
      get('EnvironmentService'),
      get('ApolloClient')
    ),
    'OdsSurveyService': object(OdsSurveyService).construct(
      get('EnvironmentService'),
      get('ApolloClient'),
      get('AuthenticationService')
    ),
    'AttendanceApiService': object(AttendanceApiService).construct(
      get('ApolloClient')
    )
  });
  return container;
}
