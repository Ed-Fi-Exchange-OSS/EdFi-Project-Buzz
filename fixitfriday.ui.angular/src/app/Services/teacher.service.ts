import { Injectable } from '@angular/core';
import { Teacher } from '../Models/teacher';
import { getStaffById } from './GraphQL/staffQueries';
import { Apollo } from 'apollo-angular';


@Injectable({ providedIn: 'root' })
export class TeacherApiService {
  controllerName = 'teacher';

  constructor(private apollo: Apollo) {
  }

  async getTeacher(): Promise<Teacher> {
    const client = this.apollo.getClient();
    const { data } = await client.query({ query: getStaffById, variables: { staffkey: 56 } });
    const staff = data.staffbyid;
    const teacher: Teacher = <Teacher>staff;

    return teacher;
  }
}
