import { Injectable } from '@angular/core';
import { Student, Guardian, Note } from '../Models/';
import { getStudentsBySection, getStudentById } from './GraphQL/studentQueries';
import { Apollo } from 'apollo-angular';
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
          studentkey: student.studentkey,
          name: `${student.studentfirstname || ''} ${student.studentmiddlename || ''} ${student.studentlastname || ''}`,
          primaryemailaddress: 'test@mail.com',
          gradelevel: student.gradelevel,
          section: data.sessionname,
          guardians,
          preferredContactMethod: student.contacts[0].preferredcontactmethod,
          contactTime: student.contacts[0].besttimetocontact,
          //contactNotes: notes,
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

  public async getById(id: string) {
    console.log("student.service:" + id);
    let student: Student;

    const client = this.apollo.getClient();
    await client.query({ query: getStudentById, variables:{studentschoolkey:id} }).then(response => {
      
      // No mapping =)
      student = response.data.student;

      // OK I lied... but just a little =P
      student.name = `${student.studentlastname || ''}, ${student.studentfirstname || ''} ${student.studentmiddlename || ''}`;
      
      if(!student.primaryemailaddress)
        student.primaryemailaddress = `${student.studentfirstname}@grandbend.com`;
      
      if(!student.pictureurl)
        student.pictureurl= '/assets/studentImage.jpg',

      student.surveys = [];      
      student.notes = [];
    });

    return student;
  }
}
