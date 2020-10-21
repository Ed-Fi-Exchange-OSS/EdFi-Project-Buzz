// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import StudentSurveyResolvers from '../resolvers/studentsurvey.resolver';
import StudentSurveyService from '../services/studentsurvey.service';
import {
  SurveyEntity,
  AnswersByStudentEntity,
} from '../entities/buzz';
import { BUZZ_DATABASE } from '../../constants';

@Module({
  imports: [TypeOrmModule.forFeature([SurveyEntity, AnswersByStudentEntity, SurveyEntity],
    BUZZ_DATABASE)],
  providers: [StudentSurveyService, StudentSurveyResolvers],
})
export default class StudentSurveyModule {}
