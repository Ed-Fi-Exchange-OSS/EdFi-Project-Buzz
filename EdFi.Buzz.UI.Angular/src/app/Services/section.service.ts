// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

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
