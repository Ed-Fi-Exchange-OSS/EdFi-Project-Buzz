import { Injectable } from '@angular/core';
import { Teacher } from '../Models/teacher';


@Injectable({ providedIn: 'root' })
export class TeacherApiService {
  controllerName = 'teacher';
  teachers: Teacher[];

  constructor() {
    this.teachers = [
      {
        id: "1",
        name: "Kathie Dillon"
      }
    ];
  }

  public get(name?: string) {
    return this.teachers
      .filter(t => name ? t.name.includes(name) : true);
  }

  getTeacher(): Teacher {
    return this.teachers[0];
  }
}
