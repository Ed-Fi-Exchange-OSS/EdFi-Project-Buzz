// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

// import { UseGuards } from '@nestjs/common';
import { Args, Resolver } from '@nestjs/graphql';
import { TaskItem } from '../graphql.schema';
import TaskItemService from '../services/taskitem.service';

@Resolver('TaskItem')
export default class TaskItemResolvers {
  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly taskItemService: TaskItemService) {}

  async addtaskitem(@Args('taskitem') taskItem: TaskItem): Promise<string> {
    return (await this.taskItemService.addTaskItem(taskItem)).id;
  }
}
