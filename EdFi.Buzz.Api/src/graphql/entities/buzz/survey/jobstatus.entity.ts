// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Entity, Column, PrimaryColumn } from 'typeorm';
import { config } from 'dotenv';

config({ path: `${__dirname}/../../../../../.env` });
@Entity({ schema: 'buzz', name: 'jobstatus', synchronize: false })
export default class JobStatusEntity {
  @PrimaryColumn({ type: 'int', nullable: false })
  jobstatuskey: number;

  @Column({ type: 'varchar', nullable: false })
  description: string;
}
