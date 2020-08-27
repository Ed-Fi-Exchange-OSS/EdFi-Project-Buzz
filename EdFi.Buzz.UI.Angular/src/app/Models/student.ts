// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { ContactPerson } from '.';

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

  notes?: StudentNote[];

  studentsurveys?: any[];

  constructor() {
    this.contacts = [];
    this.siblings = [];
    this.studentsurveys = [];
    this.notes = [];
  }
}

export class Sibling {
  name: string;
  gradeLevel: string;
  schoolName: string;
}

export class StudentNote {
  studentnotekey: number;
  studentschoolkey: string;
  staffkey: number;
  note: string;
  dateadded: Date;

  staffFullName?: string;
  staffEMail?: string;
}

export class StudentSurveySummaryAnswers {
  sectionkey?: string;
  surveykey?: number;
  title?: string;
  surveyquestionkey?: number;
  question?: string;
  studentschoolkey?: string;
  studentname?: string;
  answer?: string;
}

export class StudentSurveyQuestion {
  surveyquestionkey?: string;
  surveykey?: number;
  question?: string;
  studentanswer?: StudentSurveySummaryAnswers;
}

export class StudentSurveyMetadata {
  surveykey?: number;
  staffkey?: number;
  title?: string;
  deletedat?: string;
  questions?: StudentSurveyQuestion[];
}

export class StudentSurvey {
  studentsurveykey?: string;
  surveykey?: number;
  date?: string;
  survey?: StudentSurveyMetadata;
  answers?: StudentSurveySummaryAnswers[];
}
