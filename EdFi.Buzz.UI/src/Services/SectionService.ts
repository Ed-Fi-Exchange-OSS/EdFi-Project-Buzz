// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { ApolloClient, InMemoryCache } from '@apollo/client';

import { Section } from 'Models';
import { trackPromise } from 'react-promise-tracker';
import { getSectionsByStaff } from './GraphQL/SectionQueries';
import AuthenticationService from './AuthenticationService';

export default class SectionApiService {
  sections: Section[];

  constructor(
    private authenticationService: AuthenticationService,
    private apolloClient: ApolloClient<InMemoryCache>
  ) { }

  public getByTeacherId = async (): Promise<Section[]> => {
    const client = this.apolloClient;
    await trackPromise(client
      .query({
        query: getSectionsByStaff,
        variables: {
          staffkey: this.authenticationService.currentUserValue.teacher.staffkey
        }
      })
      .then(({ data }) => {
        this.sections = data.sectionsbystaff;
      }));
    return this.sections;
  };
}
