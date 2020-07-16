// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Injectable } from '@angular/core';
import { Student, Guardian, StudentNote } from '../Models/';
import { getStudentsBySection, getStudentById } from './GraphQL/studentQueries';
import { Apollo } from 'apollo-angular';
import { AuthenticationService } from './authentication.service';

declare var require: any;

@Injectable({ providedIn: 'root' })
export class StudentApiService {
  controllerName = 'student';
  students: Student[];

  constructor(private apollo: Apollo, private auth: AuthenticationService) { }

  public save() {
  }

  private setDefaultValues(student: Student): Student {
    if (student) {
      student.name = `${student.studentlastname || ''}, ${student.studentfirstname || ''}${( student.studentmiddlename ? ' ' + student.studentmiddlename : '' )}`;

      if (!student.pictureurl) {
        student.pictureurl = '/assets/studentImage.jpg';
      }

      if (!student.primaryemailaddress) {
        student.primaryemailaddress = `${student.studentfirstname.toLocaleLowerCase()}@grandbend.com`;
      }
    }
    return student;
  }

  public async get(section?: string, name?: string) {
    if (!section || section === 'null') {
      this.students = [];
      return this.students;
    }
    const client = this.apollo.getClient();
    const { data } = await client.query({
      query: getStudentsBySection,
      variables: {
        sectionKey: section,
        staffkey: this.auth.currentUserValue.teacher.staffkey
      }
    });

    this.students = data.sectionbystaff.students;

    return this.students
      .map(s => this.setDefaultValues(s))
      .filter(s => name ? s.name.toUpperCase().includes(name.toUpperCase()) : true)
      .sort((a, b) => a.name.localeCompare(b.name));
  }




  public async getById(studentSchoolKey: string) {
    let student: Student;

    const client = this.apollo.getClient();
    const queryParams = { staffkey: this.auth.currentUserValue.teacher.staffkey, studentschoolkey: studentSchoolKey };
    await client.query({ query: getStudentById, variables: queryParams })
      .then(response => {
        student = response.data.studentbystaff;
        this.setDefaultValues(student);
    });

    return student;
  }
}
