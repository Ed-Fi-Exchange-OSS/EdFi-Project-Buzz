// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import SurveyStatusService from '../services/surveystatus.service';
import {
  SurveyStatusEntity,
  JobStatusEntity,
  StaffEntity,
  SectionEntity,
  StudentSchoolEntity,
} from '../entities/buzz';
import SurveyStatusResolvers from '../resolvers/surveystatus.resolver';
import StaffService from '../services/staff.service';
import { BUZZ_DATABASE } from '../../constants';

@Module({
  imports: [TypeOrmModule.forFeature([
    StaffEntity,
    SectionEntity,
    StudentSchoolEntity,
    SurveyStatusEntity,
    JobStatusEntity,
  ], BUZZ_DATABASE)],
  providers: [StaffService, SurveyStatusService, SurveyStatusResolvers],
})
export default class SurveyStatusModule {}
