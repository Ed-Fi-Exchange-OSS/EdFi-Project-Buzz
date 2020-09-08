// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { ApolloClient, InMemoryCache } from '@apollo/client';
import { Section } from '../Models';
import { getSectionsByStaff } from './GraphQL/SectionQueries';
import { AuthenticationService } from '../Services/AuthenticationService';
declare var require: any;

export class SectionApiService {
  controllerName = 'section';
  sections: Section[];

  constructor(
    private apolloClient: ApolloClient<InMemoryCache>,
    private authenticationService: AuthenticationService) {}

  public async getByTeacherId() {
    const client = this.apolloClient;
    await client.query({ query: getSectionsByStaff, variables: { staffkey: this.authenticationService.currentUserValue.teacher.staffkey } })
      .then(({ data }) => this.sections = data.sectionsbystaff);
    return this.sections;
  }
}
