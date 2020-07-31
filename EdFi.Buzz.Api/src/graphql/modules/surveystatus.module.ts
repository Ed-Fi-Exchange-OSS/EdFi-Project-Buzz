// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import SurveyStatusService from '../services/surveystatus.service';
import SurveyStatusEntity from '../entities/survey/surveystatus.entity';
import SurveyStatusResolvers from '../resolvers/surveystatus.resolver';
import JobStatusEntity from '../entities/survey/jobstatus.entity';
import StaffEntity from '../entities/staff.entity';
import StaffService from '../services/staff.service';
import SectionEntity from '../entities/section.entity';
import StudentSchoolEntity from '../entities/studentschool.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    StaffEntity,
    SectionEntity,
    StudentSchoolEntity,
    SurveyStatusEntity,
    JobStatusEntity,
  ])],
  providers: [StaffService, SurveyStatusService, SurveyStatusResolvers],
})
export default class SurveyStatusModule {}
