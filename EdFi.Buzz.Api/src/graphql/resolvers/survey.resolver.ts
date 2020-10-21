// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  Args, Resolver, Mutation,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { LoadSurveyFromOdsResponse, OdsSurveyItem, Survey } from '../graphql.schema';
import AuthGuard from '../auth.guard';
import ValidateStaffIdGuard from '../guards/validateStaffId.guard';
import SurveyService from '../services/survey.service';
import TaskItemService from '../services/taskitem.service';
import { LoadSurveyFromOdsTaskItem } from '../entities/buzz';

@UseGuards(AuthGuard)
@UseGuards(ValidateStaffIdGuard)
@Resolver('Survey')
export default class SurveyResolvers {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    private readonly surveyService: SurveyService,
    private readonly taskItemService: TaskItemService,
  ) {}

  @Mutation('deletesurvey')
  async deletesurvey(
    @Args('surveykey') surveykey: number,
  ): Promise<Survey> {
    return this.surveyService.deleteSurvey(surveykey);
  }

  @Mutation('loadsurveyfromods')
  async loadsurveyfromods(
    @Args('staffkey') staffkey: string,
      @Args('surveylist') surveyList: OdsSurveyItem[],
  ): Promise<LoadSurveyFromOdsResponse> {
    const surveyFromOds: LoadSurveyFromOdsTaskItem = { staffkey, surveyList };

    const addLoadOds = this.taskItemService.addLoadOdsFromSurveyTaskItem(surveyFromOds);
    return addLoadOds;
  }
}
