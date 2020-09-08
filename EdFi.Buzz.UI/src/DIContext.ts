// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.


import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import DIContainer, { object, get } from "rsdi";

import { ApiService } from "./Services/ApiService";
import { AuthenticationService } from "./Services/AuthenticationService";
import { EnvironmentService } from "./Services/EnvironmentService";
import { TeacherApiService } from "./Services/TeacherService";



function createApolloClient() {
  const httpLink = createHttpLink({
    uri: 'http://localhost:3000/graphql',
    fetchOptions: {
        mode: 'cors',
      },
  });


  const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = sessionStorage.getItem('validatingToken');

    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      }
    }
  });

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
  });

}


export default function configureDI() {
  const container = new DIContainer();
  container.addDefinitions({
    "EnvironmentService": object(EnvironmentService),
    "ApolloClient": createApolloClient(),
    "ApiService": object(ApiService).construct(
      get("AuthenticationService"),
      get("SectionApiService"),
      get("StudentApiService"),
      get("StudentNotesApiService"),
      get("SurveyAnalyticsApiService"),
      get("TeacherApiService"),
      get("SurveyService")
    ),
    "AuthenticationService": object(AuthenticationService).construct(
      get("TeacherApiService"),
      get("ApolloClient"),
    ),
    "SectionApiService": null,
    "StudentApiService": null,
    "StudentNotesApiService": null,
    "SurveyAnalyticsApiService": null,
    "TeacherApiService": object(TeacherApiService).construct(
      get("ApolloClient")
    ),
    "SurveyService": null


  });
  return container;
}
