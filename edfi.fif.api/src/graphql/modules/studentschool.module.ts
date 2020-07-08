// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import StudentSchoolResolvers from '../resolvers/studentschool.resolver';
import StudentSchoolService from '../services/studentschool.service';
import StudentSchoolEntity from '../entities/studentschool.entity';
import StudentContactEntity from '../entities/studentcontact.entity';
import ContactPersonEntity from '../entities/contactperson.entity';
import SchoolEntity from '../entities/school.entity';
import StudentNoteEntity from '../entities/studentnote.entity';
import StudentSurveyEntity from '../entities/survey/studentsurvey.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StudentSchoolEntity,
      ContactPersonEntity,
      StudentContactEntity,
      SchoolEntity,
      StudentSurveyEntity,
      StudentNoteEntity,
    ]),
  ],
  providers: [StudentSchoolService, StudentSchoolResolvers],
})
export default class StudentSchoolModule {}
