// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import StaffService from '../services/staff.service';
import StaffEntity from '../entities/staff.entity';
import SurveyEntity from '../entities/survey/survey.entity';
import SurveyService from '../services/survey.service';
import StudentSchoolEntity from '../entities/studentschool.entity';
import SectionEntity from '../entities/section.entity';
import SurveyResolvers from '../resolvers/survey.resolver';
import TaskItemService from '../services/taskitem.service';

@Module({
  imports: [TypeOrmModule.forFeature([
    StaffEntity,
    SurveyEntity,
    StudentSchoolEntity,
    SectionEntity,
  ])],
  providers: [SurveyService, StaffService, TaskItemService, SurveyResolvers],
})
export default class SurveyModule {}
