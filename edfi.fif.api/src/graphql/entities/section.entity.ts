// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ schema: 'fif', name: 'section', synchronize: false })
export default class SectionEntity {
  @PrimaryColumn() sectionkey: string;

  @Column() schoolkey: string;

  @Column() localcoursecode: string;

  @Column() sessionname: string;

  @Column() sectionidentifier: string;

  @Column() schoolyear: number;
}
