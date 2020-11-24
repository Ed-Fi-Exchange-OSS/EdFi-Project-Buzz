// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ schema: 'buzz', name: 'attendance', synchronize: false })
export default class AttendanceEntity {
  @PrimaryColumn() studentschoolkey : string;

  @Column() reportedaspresentatschool : number;

  @Column() reportedasabsentfromschool : number;

  @Column() reportedaspresentathomeroom : number;

  @Column() reportedasabsentfromhomeroom : number;

  @Column() reportedasispresentinallsections : number;

  @Column() reportedasabsentfromanysection: number;
}
