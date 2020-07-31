// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Injectable } from '@nestjs/common';
import { makeWorkerUtils, Job } from 'graphile-worker';
import { v4 as uuidv4 } from 'uuid';
import TaskItem from '../entities/queues/taskitem.entity';

@Injectable()
export default class TaskItemService {
  connectionString = `postgres://postgres:${process.env.BUZZ_API_DB_PASSWORD}@${process.env.BUZZ_API_DB_HOST}:${parseInt(
    process.env.BUZZ_API_DB_PORT,
    10,
  )}/${process.env.BUZZ_API_DB_DATABASE}?ssl=0`;

  queueName = process.env.BUZZ_WORKER_JOB_NAME;

  async addTaskItem(taskItem: TaskItem): Promise<Job> {
    const workerUtils = await makeWorkerUtils({
      connectionString: `${this.connectionString}`,
    });
    taskItem.jobkey = uuidv4();
    return workerUtils.addJob(this.queueName, taskItem, { jobKey: taskItem.jobkey });
  }
}
