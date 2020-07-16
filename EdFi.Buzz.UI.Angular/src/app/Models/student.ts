// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { SurveyResult, Guardian, ContactPerson } from '.';

export class Student {

  studentkey?: string;
  studentschoolkey?: string;
  schoolkey?: string;

  schoolname?: String;
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


  // to Depreicate: These will be removed soon
  section?: string;
  surveys?: any[];
  notes?: any[];
  guardians?: any[];

  constructor() {
    this.contacts = [];
    this.siblings = [];
    this.surveys = [];
    this.notes = [];
    this.guardians = [];
  }
}

export class Sibling {
  name: string;
  gradeLevel: string;
  schoolName: string;
}

export class Note {
  studentnotekey: number;
  studentschoolkey: string;
  note: string;
  dateadded: Date;
  staffkey: number;
  staffFullName?: string;
  staffEMail?: string;
}
