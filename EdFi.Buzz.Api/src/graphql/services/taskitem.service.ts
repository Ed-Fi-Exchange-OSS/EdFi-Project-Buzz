// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Injectable } from '@nestjs/common';
import { makeWorkerUtils, Job } from 'graphile-worker';
import { v4 as uuidv4 } from 'uuid';
import { TaskItemEntity } from '../entities/buzz';
import LoadSurveyFromOdsTaskItem from '../entities/queues/loadSurveyFromOdsTaskitem.entity';

@Injectable()
export default class TaskItemService {
  connectionString = `postgres://postgres:${process.env.BUZZ_API_DB_PASSWORD}@${process.env.BUZZ_API_DB_HOST}:${parseInt(
    process.env.BUZZ_API_DB_PORT,
    10,
  )}/${process.env.BUZZ_API_DB_DATABASE}?ssl=0`;

  queueName = process.env.BUZZ_WORKER_JOB_NAME;

  cleanUpQueueName = process.env.BUZZ_WORKER_CLEANUP_JOB_NAME;

    buzzSurveyFromOdsQueueName = process.env.BUZZ_SURVEY_FROM_ODS_JOB_NAME;

  async addTaskItem(taskItem: TaskItemEntity): Promise<Job> {
    const task = taskItem;
    const taskUUID = uuidv4();
    const workerUtils = await makeWorkerUtils({
      connectionString: `${this.connectionString}`,
    });
    task.jobkey = taskUUID;
    this.addCleanUpTaskItem(task);
    return workerUtils.addJob(this.queueName, task, { jobKey: taskUUID });
  }

  async addCleanUpTaskItem(taskItem: TaskItemEntity): Promise<Job> {
    const task = taskItem;
    const taskUUID = uuidv4();
    const retentionDays = +(process.env.SURVEY_FILES_RETENTION_DAYS);
    const workerUtils = await makeWorkerUtils({
      connectionString: `${this.connectionString}`,
    });
    const runAt = new Date();
    runAt.setDate(runAt.getDate() + retentionDays);
    task.jobkey = taskUUID;
    return workerUtils.addJob(this.cleanUpQueueName, task, { runAt, jobKey: taskUUID });
  }

  async addLoadOdsFromSurveyTaskItem(taskItem: LoadSurveyFromOdsTaskItem): Promise<Job> {
    const taskUUID = uuidv4();
    const workerUtils = await makeWorkerUtils({
      connectionString: `${this.connectionString}`,
    });
    return workerUtils.addJob(this.buzzSurveyFromOdsQueueName,
      {
        taskItem,
        jobkey: taskUUID,
      }, { jobKey: taskUUID });
  }
}
