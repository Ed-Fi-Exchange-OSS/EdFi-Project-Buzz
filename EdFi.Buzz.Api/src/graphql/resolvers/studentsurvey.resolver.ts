// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { UseGuards } from '@nestjs/common';
import { ResolveProperty, Resolver, Parent } from '@nestjs/graphql';
import { StudentSurvey, AnswersByStudent } from '../graphql.schema';
import StudentSurveyService from '../services/studentsurvey.service';
import AuthGuard from '../auth.guard';

@UseGuards(AuthGuard)
@Resolver('StudentSurvey')
export default class StudentSurveyResolvers {
  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly studentSurveyService: StudentSurveyService) {}

  @ResolveProperty('survey')
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async studentsurveys(@Parent() parent): Promise<StudentSurvey> {
    return this.studentSurveyService.findSurvey(parent.surveykey);
  }

  @ResolveProperty('answers')
  async findAnwsersByStudent(@Parent() parent: StudentSurvey): Promise<AnswersByStudent[]> {
    return this.studentSurveyService.findAnwsersByStudent(parent.surveykey, parent.studentschoolkey);
  }
}
