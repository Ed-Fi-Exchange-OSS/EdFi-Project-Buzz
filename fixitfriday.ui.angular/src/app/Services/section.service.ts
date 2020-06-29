import { Injectable } from '@angular/core';
import { Section } from '../Models';
import { Apollo } from 'apollo-angular';
import { getSectionsByStaff } from './GraphQL/sectionQueries';
declare var require: any;

@Injectable({ providedIn: 'root' })
export class SectionApiService {
  controllerName = 'section';
  sections: Section[];

  constructor(private apollo: Apollo) {}

  public async getByTeacherId(teacherId: String) {
    const client = this.apollo.getClient();
    await client.query({ query: getSectionsByStaff, variables: { staffKey: teacherId } })
      .then(({ data }) => this.sections = data.sections);
    return this.sections;
  }
}
