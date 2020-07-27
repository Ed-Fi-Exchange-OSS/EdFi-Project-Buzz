// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Injectable } from '@nestjs/common';

import * as fs from 'fs';
import TaskItem from '../entities/queues/taskitem.entity';

@Injectable()
export default class SurveyFileService {
  writeFile(staffKey: string, fileContent: string): TaskItem {
    const taskItem = {
      filename: this.filename(),
      path: `${process.env.SURVEY_FILES_FOLDER}/${staffKey}/`,
      staffkey: staffKey,
    };
    this.createDirectory(staffKey);
    const csvText = this.decodedFileContent(fileContent);
    fs.writeFileSync(`${taskItem.path}${taskItem.filename}`, csvText);
    return taskItem;
  }

  filename = (): string => {
    const filePrefix = 'surveyfile_';
    const d = new Date();
    const datestring = `${d.getFullYear()}-${d.getMonth()
      + 1}-${d.getDate()}-${d.getHours()}-${d.getMinutes()}-${d.getSeconds()}-${d.getMilliseconds()}`;
    return `${filePrefix + datestring}.csv`;
  };

  decodedFileContent = (base64Text: string): string => {
    const buff = Buffer.from(base64Text, 'base64');
    const csvText = buff.toString('utf8');
    return csvText;
  };

  createDirectory = (staffKey: string): void => {
    const directory = `${process.env.SURVEY_FILES_FOLDER}/${staffKey}`;

    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory);
    }
  };
}
