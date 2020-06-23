import { Injectable } from '@angular/core';
import { Teacher } from '../Models/teacher';


@Injectable({ providedIn: 'root' })
export class TeacherApiService {
  controllerName = 'teacher';
  teachers: Teacher[];

  constructor() {
    this.teachers = [
      {
        id: "teacher0",
        name: "Kathie Dillon",
        sections: ["Period 4 - English I","Period 2 - Biology"]
      }
    ];
  }

  public get(name?: string) {
    return this.teachers
      .filter(t => name ? t.name.includes(name) : true);
  }
}
