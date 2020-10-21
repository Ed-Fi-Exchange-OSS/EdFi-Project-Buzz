// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { ViewEntity, ViewColumn, PrimaryColumn } from 'typeorm';
import { config } from 'dotenv';
import SurveySummaryAnswers from './surveysummaryanswers.entity';

config({ path: `${__dirname}/../../../../../.env` });
@ViewEntity({ schema: `${process.env.BUZZ_API_DB_SCHEMA}`, name: 'surveysummaryquestions', synchronize: false })
export default class SurveySummaryQuestionsEntity {
  @ViewColumn()
  surveykey: number;

  @ViewColumn()
  title: string;

  @PrimaryColumn()
  surveyquestionkey: number;

  @ViewColumn()
  question: string;

  answers?: SurveySummaryAnswers[];
}
