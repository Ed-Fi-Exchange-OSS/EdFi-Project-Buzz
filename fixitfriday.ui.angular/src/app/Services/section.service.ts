import { Injectable } from '@angular/core';
import { Section } from '../Models';
import { Apollo } from 'apollo-angular';
import { getAllSections } from './GraphQL/sectionQueries';
declare var require: any;

@Injectable({ providedIn: 'root' })
export class SectionApiService {
  controllerName = 'section';
  sections: Section[];

  constructor(private apollo: Apollo) {}

  public async get() {
    const client = this.apollo.getClient();
    await client.query({ query: getAllSections }).then(result => this.sections = result.data.sections);
    return this.sections;
  }
}
