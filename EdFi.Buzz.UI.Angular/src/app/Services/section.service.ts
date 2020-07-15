import { Injectable } from '@angular/core';
import { Section } from '../Models';
import { Apollo } from 'apollo-angular';
import { getSectionsByStaff } from './GraphQL/sectionQueries';
import { AuthenticationService } from '../Services/authentication.service';
declare var require: any;

@Injectable({ providedIn: 'root' })
export class SectionApiService {
  controllerName = 'section';
  sections: Section[];

  constructor(
    private apollo: Apollo,
    private authenticationService: AuthenticationService) {}

  public async getByTeacherId() {
    const client = this.apollo.getClient();
    await client.query({ query: getSectionsByStaff, variables: { staffkey: this.authenticationService.currentUserValue.teacher.staffkey } })
      .then(({ data }) => this.sections = data.sectionsbystaff);
    return this.sections;
  }
}
