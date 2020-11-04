// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { ViewEntity, ViewColumn, PrimaryColumn } from 'typeorm';
import { config } from 'dotenv';
import SurveySummaryQuestionsEntity from './surveysummaryquestions.entity';

config({ path: `${__dirname}/../../../../../.env` });
@ViewEntity({ schema: 'buzz', name: 'surveysummary', synchronize: false })
export default class SurveySummaryEntity {
  @ViewColumn()
  staffkey: number;

  @ViewColumn()
  sectionkey: string;

  @PrimaryColumn()
  surveykey: number;

  @ViewColumn()
  title: string;

  @ViewColumn()
  studentsanswered: number;

  @ViewColumn()
  numberofquestions: number;

  @ViewColumn()
  totalstudents: number;

  questions?: SurveySummaryQuestionsEntity[];
}
