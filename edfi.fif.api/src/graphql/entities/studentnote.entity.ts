// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'fif', name: 'studentnote', synchronize: false })
export default class StudentNoteEntity {
  @PrimaryGeneratedColumn() studentnotekey: string;

  @Column() note: string;

  @Column() studentschoolkey: string;

  @Column() staffkey: number;

  @Column() dateadded?: string;
}
