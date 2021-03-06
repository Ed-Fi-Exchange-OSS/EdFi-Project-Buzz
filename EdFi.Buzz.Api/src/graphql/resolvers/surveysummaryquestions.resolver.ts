// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.
import {
  Resolver, ResolveField, Parent, Args,
} from '@nestjs/graphql';

import { UseGuards } from '@nestjs/common';
import { SurveySummaryAnswers } from '../graphql.schema';
import SurveySummaryQuestionsService from '../services/surveysummaryquestions.service';
import AuthGuard from '../auth.guard';

@UseGuards(AuthGuard)
@Resolver('SurveySummaryQuestions')
export default class SurveySummaryQuestionsResolvers {
  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly surveySummaryQuestionsService: SurveySummaryQuestionsService) {}

  @ResolveField('answers')
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async answers(@Parent() parent,
    @Args('sectionkey', { nullable: false }) sectionkey: string): Promise<SurveySummaryAnswers[]> {
    return this.surveySummaryQuestionsService.findAnswersByQuestion(sectionkey, parent.surveyquestionkey);
  }
}
