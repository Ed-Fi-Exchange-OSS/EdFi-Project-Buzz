// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.


import { ApolloClient, createHttpLink, InMemoryCache, ApolloLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';



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



function createApolloClient() {
  const httpLink = createHttpLink({
    uri: 'http://localhost:3000/graphql',
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


/*
Change the implemention of the client to Apollo-boost will avoid the flash for 1 second showing the error page
but will require to update some API calls from UI to hanlde asyn errors:

new ApolloClient({
  uri: `${window.location.origin}/api`,
  cache: new InMemoryCache(),
  onError({ graphQLErrors, networkError }) {
    if(graphQLErrors)
      graphQLErrors.forEach(error => notification.error({
        message: 'Error',
        description: error.message
      }))
    if(networkError)
      notification.error({
        message: 'Network Error',
        description: `A network error has occurred. Please check out your connection.`
      })
  },
  request(operation) {
    const currentUser = readStore('currentUser')
    currentUser && operation.setContext({
      headers: { authorization: currentUser.token }
    })
  }
})



*/

  const errorLink = onError(
    ({ response, graphQLErrors, networkError, operation, forward }) => {
      if(graphQLErrors[0].extensions.exception.status === 401){
        window.location.replace('/login');
        response.errors = null;
      }
    }
  );

  return new ApolloClient({
    link: ApolloLink.from([errorLink, authLink, httpLink]),
    //link: authLink.concat(httpLink),
    cache: new InMemoryCache()
  });

}


export default function configureDI(): DIContainer {
  const container = new DIContainer();
  container.addDefinitions({
    'EnvironmentService': object(EnvironmentService).construct(),
    'ApolloClient': createApolloClient(),
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
    )


  });
  return container;
}
