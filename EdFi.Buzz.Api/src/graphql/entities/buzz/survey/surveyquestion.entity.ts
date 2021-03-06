// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Entity, Column, PrimaryColumn } from 'typeorm';
import { config } from 'dotenv';
import StudentSurveyAnswerEntity from './studentsurveyanswer.entity';

config({ path: `${__dirname}/../../../../../.env` });
@Entity({ schema: 'buzz', name: 'surveyquestion', synchronize: false })
export default class SurveyQuestionEntity {
  @PrimaryColumn({ type: 'varchar', nullable: false })
  surveyquestionkey: string;

  @Column({ type: 'int', nullable: false })
  surveykey: number;

  @Column({ type: 'varchar', nullable: false })
  question: string;

  studentanswer: StudentSurveyAnswerEntity;
}
