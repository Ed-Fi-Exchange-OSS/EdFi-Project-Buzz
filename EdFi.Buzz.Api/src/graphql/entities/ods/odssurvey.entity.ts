// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Entity, Column, PrimaryColumn } from 'typeorm';
import { config } from 'dotenv';

config({ path: `${__dirname}/../../../../.env` });
@Entity({ schema: 'edfi', name: 'Survey', synchronize: false })
export default class OdsSurveyEntity {
  @Column()namespace: string;

  @PrimaryColumn()surveyidentifier: string;

  @Column()educationorganizationid: number;

  @Column()surveytitle: string;

  @Column()sessionname: string;

  @Column()schoolyear: number;

  @Column()schoolid: number;

  @Column()surveycategorydescriptorid: number;

  @Column()numberadministered: number;

  @Column()discriminator: string;

  @Column()createdate: Date;

  @Column()lastmodifieddate: Date;

  @Column()id: string;
}
