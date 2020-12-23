﻿// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { ApolloClient, InMemoryCache } from '@apollo/client';
import Teacher from 'Models/Teacher';
import { trackPromise } from 'react-promise-tracker';
import { getStaffNameById, getStaffByEMail } from './GraphQL/StaffQueries';

export default class TeacherApiService {
  constructor(private apolloClient: ApolloClient<InMemoryCache>) {  }

  getTeacher = async(): Promise<Teacher> => {
    const client = this.apolloClient;
    let staff = null;
    await trackPromise(client
      .query(
        {
          query: getStaffByEMail,
          fetchPolicy: 'network-only'
        })
      .then(response => {
        staff = response.data.staffbyemail;
      }));
    const teacher: Teacher = staff as Teacher;

    return teacher;
  };

  getStaffNameByKey = async(staffKey: number): Promise<Teacher>  => {
    const client = this.apolloClient;
    let staff = null;
    await client
      .query(
        {
          query: getStaffNameById,
          variables: { staffkey: staffKey }
        })
      .then(response => {
        staff = response.data.staffbyid;
      });
    const teacher: Teacher = staff as Teacher;

    return teacher;
  };
}
