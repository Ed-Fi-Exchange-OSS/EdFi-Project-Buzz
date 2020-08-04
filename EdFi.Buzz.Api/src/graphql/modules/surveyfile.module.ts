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
import StaffEntity from '../entities/staff.entity';
import SectionEntity from '../entities/section.entity';
import StudentSchoolEntity from '../entities/studentschool.entity';
import SurveyStatusService from '../services/surveystatus.service';
import SurveyStatusEntity from '../entities/survey/surveystatus.entity';
import JobStatusEntity from '../entities/survey/jobstatus.entity';
import SurveyEntity from '../entities/survey/survey.entity';
import SurveyService from '../services/survey.service';
import SurveyQuestionEntity from '../entities/survey/surveyquestion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    StaffEntity,
    SectionEntity,
    StudentSchoolEntity,
    SurveyEntity,
    SurveyStatusEntity,
    JobStatusEntity,
    SurveyQuestionEntity,
  ])],
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
