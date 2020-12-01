// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.
import { UseGuards } from '@nestjs/common';
import {
  Args, Resolver, Query,
} from '@nestjs/graphql';
import AuthGuard from "../auth.guard";
import { StudentAssessment } from "../graphql.schema";
import AssessmentService from "../services/assessment.service";

@UseGuards(AuthGuard)
@Resolver('Assessment')
export default class AssessmentResolvers {
  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly assessmentService: AssessmentService) {}

  async assessments(): Promise<StudentAssessment[]> {
    return this.assessmentService.findAll();
  }

  @Query('assessmentsbystudentschool')
  async findOneByStudentSchool(@Args('studentschoolkey') studentschoolkey: string): Promise<StudentAssessment[]> {
    return this.assessmentService.findByStudentSchool(studentschoolkey);
  }
}
