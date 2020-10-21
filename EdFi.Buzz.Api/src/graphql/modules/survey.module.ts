// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import StaffService from '../services/staff.service';
import {
  StaffEntity,
  SurveyEntity,
  StudentSchoolEntity,
  SectionEntity,
} from '../entities/buzz';
import SurveyService from '../services/survey.service';
import SurveyResolvers from '../resolvers/survey.resolver';
import { BUZZ_DATABASE } from '../../constants';

@Module({
  imports: [TypeOrmModule.forFeature([
    StaffEntity,
    SurveyEntity,
    StudentSchoolEntity,
    SectionEntity,
  ], BUZZ_DATABASE)],
  providers: [SurveyService, StaffService, SurveyResolvers],
})
export default class SurveyModule {}
