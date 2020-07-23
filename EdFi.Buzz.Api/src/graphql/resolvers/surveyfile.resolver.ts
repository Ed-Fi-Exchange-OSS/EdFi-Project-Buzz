// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Args, Resolver, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import SurveyFileService from '../services/surveyfile.service';
import AuthGuard from '../auth.guard';
import ValidateStaffIdGuard from '../guards/validateStaffId.guard';
import TaskItemService from '../services/taskitem.service';

@UseGuards(AuthGuard)
@UseGuards(ValidateStaffIdGuard)
@Resolver('SurveyFile')
export default class SurveyFileResolvers {
  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly surveyFileService: SurveyFileService, private readonly taskItemService: TaskItemService) {}

  @Mutation('uploadsurvey')
  async uploadsurvey(
    @Args('staffkey') staffkey: number,
    @Args('content') content: string,
    @Args('title') title: string,
  ): Promise<string> {
    const taskItem = this.surveyFileService.writeFile(staffkey.toString(), content);
    taskItem.title = title;
    return (await this.taskItemService.addTaskItem(taskItem)).key;
  }
}
