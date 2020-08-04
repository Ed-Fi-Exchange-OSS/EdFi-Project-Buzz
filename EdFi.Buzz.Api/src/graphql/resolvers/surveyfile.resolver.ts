// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  Args, Resolver, Mutation,
} from '@nestjs/graphql';
import { UseGuards, UnauthorizedException } from '@nestjs/common';

import SurveyFileService from '../services/surveyfile.service';
import AuthGuard from '../auth.guard';
import ValidateStaffIdGuard from '../guards/validateStaffId.guard';
import TaskItemService from '../services/taskitem.service';
import SurveyStatusService from '../services/surveystatus.service';
import SurveyStatusEntity from '../entities/survey/surveystatus.entity';
import SurveyService from '../services/survey.service';

@UseGuards(AuthGuard)
@UseGuards(ValidateStaffIdGuard)
@Resolver('SurveyFile')
export default class SurveyFileResolvers {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    private readonly surveyFileService: SurveyFileService,
    private readonly taskItemService: TaskItemService,
    private readonly surveyStatusService: SurveyStatusService,
    private readonly surveyService: SurveyService,
  ) {}

  @Mutation('uploadsurvey')
  async uploadsurvey(
    @Args('staffkey') staffkey: number,
      @Args('content') content: string,
      @Args('title') title: string,
      @Args('surveykey') surveykey: number,
  ): Promise<SurveyStatusEntity> {
    const errorMessage = `You don't have access to update survey '${surveykey}'.`;
    const taskItem = this.surveyFileService.writeFile(staffkey.toString(), content);
    taskItem.title = title;
    if (surveykey !== null) {
      const currentSurvey = (await this.surveyService.findOneById(surveykey));

      if (currentSurvey !== null && (currentSurvey !== undefined || currentSurvey.staffkey !== staffkey)) {
        throw new UnauthorizedException(errorMessage);
      }
      taskItem.updatesurvey = true;
    }
    return this.surveyStatusService.addSurveyStatus({
      surveystatuskey: null,
      staffkey,
      jobkey: (await this.taskItemService.addTaskItem(taskItem)).key,
      jobstatuskey: Number(process.env.SURVEY_PROCESS_INITIAL_STATUS_KEY),
      surveykey,
      resultsummary: null,
    });
  }
}
