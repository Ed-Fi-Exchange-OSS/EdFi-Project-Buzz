// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Entity, Column, PrimaryColumn } from 'typeorm';
import { config } from 'dotenv';
import StudentSurveyEntity from './survey/studentsurvey.entity';
import StudentNoteEntity from './studentnote.entity';

config({ path: `${__dirname}/../../../../.env` });
@Entity({ schema: `${process.env.BUZZ_API_DB_SCHEMA}`, name: 'studentschool', synchronize: false })
export default class StudentSchoolEntity {
  @PrimaryColumn() studentschoolkey: string;

  @Column() studentkey: string;

  @Column() schoolkey: string;

  @Column() schoolyear: string;

  @Column() studentfirstname: string;

  @Column() studentmiddlename: string;

  @Column() studentlastname: string;

  @Column() enrollmentdatekey: string;

  @Column() gradelevel: string;

  @Column() limitedenglishproficiency: string;

  @Column() ishispanic: boolean;

  @Column() sex: string;

  @Column() pictureurl: string;

  studentsurveys?: StudentSurveyEntity[];

  notes?: StudentNoteEntity[];
}
