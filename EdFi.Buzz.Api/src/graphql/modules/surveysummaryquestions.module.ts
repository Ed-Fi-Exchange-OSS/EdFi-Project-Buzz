// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import SurveySummaryQuestionsResolvers from '../resolvers/surveysummaryquestions.resolver';
import SurveySummaryQuestionsService from '../services/surveysummaryquestions.service';
import {
  SurveySummaryQuestionsEntity,
  SurveySummaryAnswersEntity,
} from '../entities/buzz';
import { BUZZ_DATABASE } from '../../constants';

@Module({
  imports: [TypeOrmModule.forFeature([SurveySummaryQuestionsEntity, SurveySummaryAnswersEntity],
    BUZZ_DATABASE)],
  providers: [SurveySummaryQuestionsService, SurveySummaryQuestionsResolvers],
})
export default class SurveySummaryQuestionsModule {}
