// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import SurveySummaryEntity from '../entities/survey/SurveySummary.entity';
import SurveySummaryQuestionsEntity from '../entities/survey/surveysummaryquestions.entity';

@Injectable()
export default class SurveySummaryService {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    @InjectRepository(SurveySummaryEntity) private readonly FixItFridayRepository: Repository<SurveySummaryEntity>,
    @InjectRepository(SurveySummaryQuestionsEntity)
    private readonly FixItFridayQuestionsRepository: Repository<SurveySummaryQuestionsEntity>,
  ) {}

  async findAll(title: string, staffkey: number, sectionkey: string): Promise<SurveySummaryEntity[]> {
    if (title) {
      return this.FixItFridayRepository.createQueryBuilder('SurveySummary')
        .where(
          `SurveySummary.staffkey = '${staffkey}' AND SurveySummary.sectionkey = '${sectionkey}' AND LOWER(SurveySummary.title) like LOWER('%${title}%')`,
        )
        .getMany();
    }
    return this.FixItFridayRepository.createQueryBuilder('SurveySummary')
      .where(`SurveySummary.staffkey = '${staffkey}' AND SurveySummary.sectionkey = '${sectionkey}'`)
      .getMany();
  }

  async findQuestionsBySurvey(surveykey: number): Promise<SurveySummaryQuestionsEntity[]> {
    return this.FixItFridayQuestionsRepository.createQueryBuilder('SurveySummaryQuestions')
      .leftJoin(SurveySummaryEntity, 'ss', `SurveySummaryQuestions.surveykey = ss.surveykey and ss.surveykey='${surveykey}'`)
      .where({ surveykey })
      .getMany();
  }
}
