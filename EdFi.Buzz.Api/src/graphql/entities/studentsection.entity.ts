// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Entity, Column, PrimaryColumn } from 'typeorm';
import { config } from 'dotenv';

config({ path: `${__dirname}/../../../.env` });
@Entity({ schema: `${process.env.BUZZ_API_DB_SCHEMA}`, name: 'studentsection', synchronize: false })
export default class StudentSectionEntity {
  @PrimaryColumn() studentsectionkey: string;

  @Column() studentschoolkey: string;

  @Column() studentkey: string;

  @Column() sectionkey: string;

  @Column() localcoursecode: string;

  @Column() subject: string;

  @Column() coursetitle: string;

  @Column() teachername: string;

  @Column() studentsectionstartdatekey: string;

  @Column() studentsectionenddatekey: string;

  @Column() schoolkey: string;

  @Column() schoolyear: string;
}
