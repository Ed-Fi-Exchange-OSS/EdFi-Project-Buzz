// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.
import { UseGuards } from '@nestjs/common';
import {
  Args, Resolver, Query,
} from '@nestjs/graphql';
import AuthGuard from '../auth.guard';
import StudentAssessmentEntity from '../entities/buzz/studentassessment.entity';
import AssessmentService from '../services/assessment.service';

@UseGuards(AuthGuard)
@Resolver('Assessment')
export default class AssessmentResolvers {
  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly assessmentService: AssessmentService) {}

  @Query('assessmentsbystudentschool')
  async findOneByStudentSchool(@Args('studentschoolkey') studentschoolkey: string): Promise<StudentAssessmentEntity[]> {
    return this.assessmentService.findByStudentSchool(studentschoolkey);
  }
}
