// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import SurveyFileService from '../services/surveyfile.service';
import SurveyFileResolvers from '../resolvers/surveyfile.resolver';
import TaskItemService from '../services/taskitem.service';
import StaffService from '../services/staff.service';
import SurveyStatusService from '../services/surveystatus.service';
import {
  StaffEntity,
  SectionEntity,
  StudentSchoolEntity,
  SurveyStatusEntity,
  JobStatusEntity,
  SurveyEntity,
  SurveyQuestionEntity,
} from '../entities/buzz';
import SurveyService from '../services/survey.service';
import { BUZZ_DATABASE } from '../../constants';

@Module({
  imports: [TypeOrmModule.forFeature([
    StaffEntity,
    SectionEntity,
    StudentSchoolEntity,
    SurveyEntity,
    SurveyStatusEntity,
    JobStatusEntity,
    SurveyQuestionEntity,
  ], BUZZ_DATABASE)],
  providers: [
    SurveyFileService,
    TaskItemService,
    StaffService,
    SurveyService,
    SurveyStatusService,
    SurveyFileResolvers,
  ],
})
export default class SurveyFileModule {}
