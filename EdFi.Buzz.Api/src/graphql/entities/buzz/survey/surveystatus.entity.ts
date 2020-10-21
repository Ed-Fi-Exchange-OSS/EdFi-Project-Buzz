// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { config } from 'dotenv';
import JobStatusEntity from './jobstatus.entity';

config({ path: `${__dirname}/../../../../../.env` });
@Entity({ schema: `${process.env.BUZZ_API_DB_SCHEMA}`, name: 'surveystatus', synchronize: false })
export default class SurveyStatusEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  surveystatuskey: number;

  @Column({ type: 'int', nullable: false })
  staffkey: number;

  @Column() surveykey: number;

  @Column({ type: 'varchar', nullable: false })
  jobkey: string;

  @Column({ type: 'int', nullable: false })
  jobstatuskey: number;

  @Column({ type: 'varchar', nullable: true })
  resultsummary: string;

  jobstatus?: JobStatusEntity;
}
