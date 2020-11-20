// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { ApolloClient, InMemoryCache } from '@apollo/client';
import { getAttendanceData } from './GraphQL/AttendanceQueries';
import { Attendance } from '../Models';

export default class AttendanceApiService {

  constructor(private apolloClient: ApolloClient<InMemoryCache>) { }

  public getAttendanceData = async (studentSchoolKey: string): Promise<Attendance> => {
    let attendance: Attendance;

    const client = this.apolloClient;
    const queryParams = { studentschoolkey: studentSchoolKey };
    await client.query({ query: getAttendanceData, variables: queryParams, fetchPolicy: 'network-only' })
      .then(response => {
        attendance = response.data.attendancebystudentschool;
      });

    return attendance;
  };
}
