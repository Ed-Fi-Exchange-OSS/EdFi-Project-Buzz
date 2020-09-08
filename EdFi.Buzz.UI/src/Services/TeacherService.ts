// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { ApolloClient, InMemoryCache } from '@apollo/client';

import { Teacher } from '../Models/Teacher';
import { getStaffNameById, getStaffByEMail } from './GraphQL/StaffQueries';


export class TeacherApiService {
  controllerName = 'teacher';

  constructor(private apolloClient: ApolloClient<InMemoryCache>) {
  }

  async getTeacher(): Promise<Teacher> {
    const client = this.apolloClient;
    const { data } = await client.query({ query: getStaffByEMail, fetchPolicy: 'network-only' });
    const staff = data.staffbyemail;
    const teacher: Teacher = staff as Teacher;

    return teacher;
  }

  async getStaffNameByKey(staffKey: number) {
    const client = this.apolloClient;
    const { data } = await client.query({ query: getStaffNameById, variables: { staffkey: staffKey } });
    const staff = data.staffbyid;
    const teacher: Teacher = staff as Teacher;

    return teacher;
  }
}
