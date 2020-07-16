// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Injectable } from '@angular/core';
import { Student, Guardian, Note } from '../Models/';
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
    localStorage.setItem('studentList', JSON.stringify(this.students));
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

    this.students = data.sectionbystaff.students.map(
      (student: any) => {
        const guardians: Guardian[] = student.contacts.map(
          (contact) => {
            const mappedGuardian: Guardian = {
              name: `${contact.contactfirstname || ''} ${contact.contactlastname || ''}`,
              relationship: contact.relationshiptostudent,
              email: contact.primaryemailaddress,
              phone: contact.phonenumber,
              address: `${contact.streetnumbername}, ${contact.apartmentroomsuitenumber}`,
              isPrimaryContact: contact.isprimarycontact
            };
            return mappedGuardian;
          }
        );
        const notes: string[] = student && student.contacts && student.contacts.length > 0 ? [student.contacts[0].contactnotes] : [];
        const typedStudent: Student = {
          studentkey: student.studentkey,
          studentschoolkey: student.studentschoolkey,
          name: `${student.studentfirstname || ''} ${student.studentmiddlename || ''} ${student.studentlastname || ''}`,
          schoolname: 'Grand Bend High',
          primaryemailaddress: 'test@mail.com',
          gradelevel: student.gradelevel,
          section: data.sessionname,
          contacts: student.contacts,
          // preferredContactMethod: student.contacts[0].preferredcontactmethod,
          // contactTime: student.contacts[0].besttimetocontact,
          // contactNotes: notes,
          guardians: guardians,
          siblings: [],
          surveys: [],
          pictureurl: '/assets/studentImage.jpg',
          notes
        };

        return typedStudent;
      }
    );

    return this.students
      .filter(s => name ? s.name.toUpperCase().includes(name.toUpperCase()) : true)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  public async getById(id: string) {
    console.log('student.service:' + id);
    let student: Student;

    const client = this.apollo.getClient();
    const queryparams = { staffkey: this.auth.currentUserValue.teacher.staffkey, studentschoolkey: id };
    await client.query({ query: getStudentById, variables: queryparams }).then(response => {
      // No mapping =)
      student = response.data.studentbystaff;
      console.log(student);

      // OK I lied... but just a little =P
      if (student) {
        student.name = `${student.studentlastname || ''}, ${student.studentfirstname || ''} ${student.studentmiddlename || ''}`;

        if (!student.primaryemailaddress) {
          student.primaryemailaddress = `${student.studentfirstname}@grandbend.com`;
        }

        if (!student.pictureurl) {
          student.pictureurl = '/assets/studentImage.jpg';
        }
      }
    });

    return student;
  }
}
