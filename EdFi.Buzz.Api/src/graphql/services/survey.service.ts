// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import SurveyEntity from '../entities/survey/survey.entity';

@Injectable()
export default class SurveyService {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    @InjectRepository(SurveyEntity) private readonly BuzzRepository: Repository<SurveyEntity>,
  ) {}

  async deleteSurvey(surveyKey: string): Promise<SurveyEntity> {
    const d = new Date();
    const datestring = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    const surveyToDelete = await this.BuzzRepository.findOne(surveyKey);
    surveyToDelete.deletedat = datestring;
    return this.BuzzRepository.save(surveyToDelete);
  }
}
