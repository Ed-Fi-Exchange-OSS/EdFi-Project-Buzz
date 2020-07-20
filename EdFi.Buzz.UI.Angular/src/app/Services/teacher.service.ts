// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Injectable } from '@angular/core';
import { Teacher } from '../Models/teacher';
import { getStaffNameById, getStaffByEMail } from './GraphQL/staffQueries';
import { Apollo } from 'apollo-angular';


@Injectable({ providedIn: 'root' })
export class TeacherApiService {
  controllerName = 'teacher';

  constructor(private apollo: Apollo) {
  }

  async getTeacher(): Promise<Teacher> {
    const client = this.apollo.getClient();
    const { data } = await client.query({ query: getStaffByEMail });
    const staff = data.staffbyemail;
    const teacher: Teacher = <Teacher>staff;

    return teacher;
  }

  async getStaffNameByKey(staffKey: number) {
    const client = this.apollo.getClient();
    const { data } = await client.query({ query: getStaffNameById, variables: { staffkey: staffKey } });
    const staff = data.staffbyid;
    const teacher: Teacher = <Teacher>staff;

    return teacher;
  }
}
