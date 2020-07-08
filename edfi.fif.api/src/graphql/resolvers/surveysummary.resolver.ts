// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Args, Query, Resolver, ResolveProperty, Parent } from '@nestjs/graphql';
import { SurveySummary, SurveySummaryQuestions } from '../graphql.schema';
import SurveySummaryService from '../services/surveysummary.service';

@Resolver('SurveySummary')
export default class SurveySummaryResolvers {
  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly surveySummaryService: SurveySummaryService) {}

  @Query()
  async surveysummary(
    @Args('title', { nullable: false }) title: string,
    @Args('staffkey', { nullable: false }) staffkey: number,
    @Args('sectionkey', { nullable: false }) sectionkey: string,
  ): Promise<SurveySummary[]> {
    return this.surveySummaryService.findAll(title, staffkey, sectionkey);
  }

  @ResolveProperty('questions')
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async questions(@Parent() parent): Promise<SurveySummaryQuestions[]> {
    return this.surveySummaryService.findQuestionsBySurvey(parent.surveykey);
  }
}