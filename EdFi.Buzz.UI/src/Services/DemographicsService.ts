// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { ApolloClient, InMemoryCache } from '@apollo/client';
import { getDemographicsCharacteristicsData, studentprogramsbystudentschool } from './GraphQL/DemographicsQueries';
import { Demographic } from '../Models';

export default class DemographicsApiService {

  constructor(private apolloClient: ApolloClient<InMemoryCache>) { }

  public getDemographicsCharacteristicsData = async (studentSchoolKey: string): Promise<Demographic[]> => {
    let demographics: Demographic[];

    const client = this.apolloClient;
    const queryParams = { studentschoolkey: studentSchoolKey };
    await client.query({ query: getDemographicsCharacteristicsData, variables: queryParams, fetchPolicy: 'network-only' })
      .then(response => {
        demographics = response.data.studentcharacteristicsbystudentschool;
      });

    return demographics;
  };

  public getDemographicsProgramsData = async (studentSchoolKey: string): Promise<Demographic[]> => {
    let demographics: Demographic[];

    const client = this.apolloClient;
    const queryParams = { studentschoolkey: studentSchoolKey };
    await client.query({ query: studentprogramsbystudentschool, variables: queryParams, fetchPolicy: 'network-only' })
      .then(response => {
        demographics = response.data.studentprogramsbystudentschool;
      });

    return demographics;
  };
}
