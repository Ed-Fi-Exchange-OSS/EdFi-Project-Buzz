// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  Args, Resolver, Mutation,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { Survey } from '../graphql.schema';
import AuthGuard from '../auth.guard';
import ValidateStaffIdGuard from '../guards/validateStaffId.guard';
import SurveyService from '../services/survey.service';

@UseGuards(AuthGuard)
@UseGuards(ValidateStaffIdGuard)
@Resolver('Survey')
export default class SurveyResolvers {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    private readonly surveyService: SurveyService,
  ) {}

  @Mutation('deletesurvey')
  async deletesurvey(
    @Args('surveykey') surveykey: string,
  ): Promise<Survey> {
    return this.surveyService.deleteSurvey(surveykey);
  }
}
