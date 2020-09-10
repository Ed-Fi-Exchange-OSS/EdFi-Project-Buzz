// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { Student } from '../Models';
import { getStudentsBySection, getStudentById } from './GraphQL/StudentQueries';
import AuthenticationService from './AuthenticationService';

export default class StudentApiService {
  students: Student[];

  /* eslint no-useless-constructor: "warn"*/
  constructor(private auth: AuthenticationService, private apolloClient: ApolloClient<InMemoryCache>) { }

  public get = async(section?: string, name?: string): Promise<Student[]> => {
    if (!section || section === 'null') {
      this.students = [];
      return this.students;
    }
    const client = this.apolloClient;
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
  };

  public getById = async (studentSchoolKey: string): Promise<Student> => {
    let student: Student;

    const client = this.apolloClient;
    const queryParams = { staffkey: this.auth.currentUserValue.teacher.staffkey, studentschoolkey: studentSchoolKey };
    await client.query({ query: getStudentById, variables: queryParams })
      .then(response => {
        student = response.data.studentbystaff;
        this.setDefaultValues(student);
      });

    return student;
  };

  private setDefaultValues = (studentParam: Student): Student => {
    const student = studentParam;
    if (student) {
      student.name =
          `${student.studentlastname || ''},
            ${student.studentfirstname || ''}
            ${( student.studentmiddlename ? `
            ${  student.studentmiddlename}` : '' )}`;

      if (!student.pictureurl) {
        student.pictureurl = '/assets/studentImage.jpg';
      }

      if (!student.primaryemailaddress) {
        student.primaryemailaddress = `${student.studentfirstname.toLocaleLowerCase()}@grandbend.com`;
      }
    }
    return student;
  };


}
