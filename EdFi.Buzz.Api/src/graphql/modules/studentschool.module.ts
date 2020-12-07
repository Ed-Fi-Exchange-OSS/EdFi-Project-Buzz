// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import StudentSchoolResolvers from '../resolvers/studentschool.resolver';
import StudentSchoolService from '../services/studentschool.service';
import DemographicsService from '../services/demographics.service';
import {
  StudentSchoolEntity,
  StudentContactEntity,
  ContactPersonEntity,
  SchoolEntity,
  StudentNoteEntity,
  StudentSurveyEntity,
  SurveyEntity,
  AttendanceEntity,
  DemographicsEntity,
} from '../entities/buzz';
import { BUZZ_DATABASE } from '../../constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StudentSchoolEntity,
      ContactPersonEntity,
      StudentContactEntity,
      SchoolEntity,
      StudentSurveyEntity,
      StudentNoteEntity,
      SurveyEntity,
      AttendanceEntity,
      DemographicsEntity,
    ], BUZZ_DATABASE),
  ],
  providers: [StudentSchoolService, DemographicsService, StudentSchoolResolvers],
})
export default class StudentSchoolModule {}
