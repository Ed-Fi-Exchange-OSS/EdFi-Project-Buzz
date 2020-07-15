// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Entity, Column, PrimaryColumn } from 'typeorm';
import { config } from 'dotenv';

config({ path: `${__dirname}/../../../.env` });
@Entity({ schema: `${process.env.BUZZ_API_DB_SCHEMA}`, name: 'school', synchronize: false })
export default class SchoolEntity {
  @PrimaryColumn() schoolkey: string;

  @Column() schoolname: string;

  @Column() schooltype: string;

  @Column() schooladdress: string;

  @Column() schoolcity: string;

  @Column() schoolcounty: string;

  @Column() schoolstate: string;

  @Column() localeducationagencyname: string;

  @Column() localeducationagencykey: number;

  @Column() stateeducationagencyname: string;

  @Column() stateeducationagencykey: number;

  @Column() educationservicecentername: string;

  @Column() educationservicecenterkey: number;
}
