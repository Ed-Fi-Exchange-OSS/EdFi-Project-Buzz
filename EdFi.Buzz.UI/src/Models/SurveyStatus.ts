// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.
import JobStatus from './JobStatus';

export default class SurveyStatus {
  surveystatuskey: number;

  staffkey: number;

  surveykey: number;

  jobkey: string;

  jobstatuskey: number;

  resultsummary: string;

  // eslint-disable-next-line
  resultSummaryObj: any;

  jobstatus: JobStatus;
}
