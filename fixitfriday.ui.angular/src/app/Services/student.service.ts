import { Injectable } from '@angular/core';
import { Student } from '../Models/student';
declare var require: any

@Injectable({ providedIn: 'root' })
export class StudentApiService {
  controllerName = 'student';
  students: Student[];

  constructor() {
    let storStudents = localStorage.getItem("studentList");
    if (storStudents){
      this.students = JSON.parse(storStudents);
    }else{ 
      this.students = require('src/assets/students.json');
    }
  }

  public save(){
    localStorage.setItem("studentList", JSON.stringify(this.students));
  }

  public get(section?: string, name?: string) {
    return this.students
      .filter(s => name ? s.name.toUpperCase().includes(name.toUpperCase()) : true)
      .filter(s => section && section != "null" ? s.section == section : true)
      .sort( (a, b) => a.name.localeCompare(b.name) );
  }

  public getById(id: string) {
    return this.students
      .filter(s => s.studentId == id)
      .sort( (a, b) => a.name.localeCompare(b.name) );
  }
}
