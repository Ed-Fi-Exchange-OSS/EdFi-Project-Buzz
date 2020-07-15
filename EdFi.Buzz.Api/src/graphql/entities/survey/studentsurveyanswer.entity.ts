// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Entity, Column, PrimaryColumn } from 'typeorm';
import { config } from 'dotenv';

config({ path: `${__dirname}/../../../../.env` });
@Entity({ schema: `${process.env.BUZZ_API_DB_SCHEMA}`, name: 'studentsurveyanswer', synchronize: false })
export default class StudentSurveyAnswerEntity {
  @PrimaryColumn({ type: 'varchar', nullable: false })
  studentsurveyanswerkey: string;

  @Column({ type: 'varchar', nullable: false })
  studentsurveykey: string;

  @Column({ type: 'varchar', nullable: false })
  surveyquestion: string;

  @Column({ type: 'varchar', nullable: false })
  answer: string;
}
