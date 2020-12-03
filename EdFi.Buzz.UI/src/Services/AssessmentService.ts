// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { ApolloClient, InMemoryCache } from '@apollo/client';
import { getAssessmentData } from './GraphQL/AssessmentQueries';
import { Assessment } from '../Models';

export default class AssessmentApiService {

  constructor(private apolloClient: ApolloClient<InMemoryCache>) { }

  public getAssessmentData = async (studentSchoolKey: string): Promise<Assessment[]> => {
    let assessment: Assessment[];

    const client = this.apolloClient;
    const queryParams = { studentschoolkey: studentSchoolKey };
    await client.query({ query: getAssessmentData, variables: queryParams, fetchPolicy: 'network-only' })
      .then(response => {
        assessment = response.data.assessmentsbystudentschool;
      });

    return assessment;
  };
}
