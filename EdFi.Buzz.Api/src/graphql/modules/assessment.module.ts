// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import AssessmentResolvers from '../resolvers/assessment.resolver';
import AssessmentService from '../services/assessment.service';
import { BUZZ_DATABASE } from '../../constants';
import StudentAssessmentEntity from '../entities/buzz/studentassessment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StudentAssessmentEntity], BUZZ_DATABASE)],
  providers: [AssessmentService, AssessmentResolvers],
})
export default class StudentAssessmentModule {}
