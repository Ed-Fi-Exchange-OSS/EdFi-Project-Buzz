// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

export class SurveyMetadata {
  surveyId: number;
  surveyName: string;
  questionCount: number;
  totalStudents: number;
  studentsAnswered: number;
}

export class SurveyQuestionSummary {
  surveykey: number;
  question: string;
  answers: { label: string, count: number }[];
}


export class SurveyQuestionAnswers {
  answers: SurveyQuestionAnswer[];
  question: string;
  surveyquestionkey: number;
}

export class SurveyQuestionAnswer {
  answer: string;
  studentname: string;
  studentschoolkey: string;
}

export class AllStudentAnswers {
  studentname: string;
  studentschoolkey: string;
  questions: { [Key: number]: string };
  answers: { [Key: number]: string };
}

export class SurveyStatus {
  surveystatuskey: number;
  staffkey: number;
  surveykey: number;
  jobkey: string;
  jobstatuskey: number;
  resultsummary: string;
  resultSummaryObj: any;
  jobstatus: JobStatus;
}

export class JobStatus {
  jobstatuskey: number;
  description: string;
}
