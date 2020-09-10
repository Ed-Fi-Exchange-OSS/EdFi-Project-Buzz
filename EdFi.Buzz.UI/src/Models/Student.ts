// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import ContactPerson from './ContactPerson';
import StudentNote from './StudentNote';
import StudentSurvey from './StudentSurvey';

export default class Student {

  studentkey?: string;

  studentschoolkey?: string;

  schoolkey?: string;

  schoolname?: string;

  schoolyear?: string;

  name?: string;

  studentfirstname?: string;

  studentmiddlename?: string;

  studentlastname?: string;

  primaryemailaddress?: string;

  enrollmentdatekey?: string;

  gradelevel?: string;

  limitedenglishproficiency?: string;

  ishispanic?: boolean;

  sex?: string;

  pictureurl?: string;

  contacts?: ContactPerson[];

  siblingscount?: number;

  siblings?: Student[];

  notes?: StudentNote[];

  studentsurveys?: StudentSurvey[];

  constructor() {
    this.contacts = [];
    this.siblings = [];
    this.studentsurveys = [];
    this.notes = [];
  }
}



