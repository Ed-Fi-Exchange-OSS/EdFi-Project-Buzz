// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Entity, Column, PrimaryColumn } from 'typeorm';
import SurveyEntity from './survey.entity';
import AnswersByStudentEntity from './answersbystudent.entity';

@Entity({ schema: 'fif', name: 'studentsurvey', synchronize: false })
export default class StudentSurveyEntity {
  @PrimaryColumn({ type: 'varchar', nullable: false })
  studentsurveykey: string;

  @Column({ type: 'varchar', nullable: false })
  surveykey: string;

  @Column({ type: 'varchar', nullable: false })
  studentschoolkey: string;

  @Column({ type: 'varchar', nullable: false })
  date: string;

  survey: SurveyEntity;

  answers: AnswersByStudentEntity[];
}
