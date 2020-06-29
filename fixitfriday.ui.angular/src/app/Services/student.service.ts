import { Injectable } from '@angular/core';
import { Student, Guardian, Note } from '../Models/';
import { Apollo } from 'apollo-angular';
import { getStudentsBySection } from './GraphQL/studentQueries';
declare var require: any

@Injectable({ providedIn: 'root' })
export class StudentApiService {
  controllerName = 'student';
  students: Student[];

  constructor(private apollo: Apollo) {}

  public save(){
    localStorage.setItem("studentList", JSON.stringify(this.students));
  }

  public async get(section?: string, name?: string) {
    if(!section|| section === 'null') {
      this.students = [];
      return this.students;
    }
    console.log({section,name})
    const client = this.apollo.getClient();
    const { data } = await client.query({ query: getStudentsBySection });


    this.students = data.students.map(
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
        )
        const notes: string[] = [ student.contacts[0].contactnotes, ]
        const typedStudent: Student = {
          studentId: student.studentkey,
          name: `${student.studentfirstname || ''} ${student.studentmiddlename || ''} ${student.studentlastname || ''}`,
          email: 'test@mail.com',
          gradeLevel: student.gradelevel,
          section: data.sessionname,
          guardians,
          preferredContactMethod: student.contacts[0].preferredcontactmethod,
          contactTime: student.contacts[0].besttimetocontact,
          contactNotes: notes,
          //siblings
          //surveys
          pictureUrl: '/assets/studentImage.jpg'
          //notes
        };

        return typedStudent;
      }
    );

    return this.students
      .filter(s => name ? s.name.toUpperCase().includes(name.toUpperCase()) : true)
      .sort( (a, b) => a.name.localeCompare(b.name) );
  }

  public getById(id: string) {
    return this.students
      .filter(s => s.studentId == id)
      .sort( (a, b) => a.name.localeCompare(b.name) );
  }
}
