// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Section } from './section';

export class Teacher {
  sections: Section[];

  staffkey: number;
  personaltitleprefix: string;
  lastsurname: string;
  firstname: string;
  middlename: string;
  electronicmailaddress: string;
  isadminsurveyloader: boolean;
  isteachersurveyloader: boolean;

  constructor() {
    this.sections = [];
  }
}
