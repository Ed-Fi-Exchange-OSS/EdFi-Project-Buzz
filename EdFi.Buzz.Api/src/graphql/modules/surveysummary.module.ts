// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import StaffService from '../services/staff.service';
import {
  StaffEntity,
  SectionEntity,
  StudentSchoolEntity,
  SurveySummaryEntity,
  SurveySummaryQuestionsEntity,
} from '../entities/buzz';
import SurveySummaryResolvers from '../resolvers/surveysummary.resolver';
import SurveySummaryService from '../services/surveysummary.service';
import { BUZZ_DATABASE } from '../../constants';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [SurveySummaryEntity, SurveySummaryQuestionsEntity, StaffEntity, SectionEntity, StudentSchoolEntity],
      BUZZ_DATABASE,
    ),
  ],
  providers: [SurveySummaryService, StaffService, SurveySummaryResolvers],
})
export default class SurveySummaryModule {}
