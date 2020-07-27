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
    @InjectRepository(SurveySummaryEntity) private readonly BuzzRepository: Repository<SurveySummaryEntity>,
    @InjectRepository(SurveySummaryQuestionsEntity)
    private readonly BuzzQuestionsRepository: Repository<SurveySummaryQuestionsEntity>,
  ) {}

  async findAll(
    title: string, staffkey: number, sectionkey: string, surveykey?: number,
  ): Promise<SurveySummaryEntity[]> {
    const surveyTitleFilter = title ? ` AND LOWER(SurveySummary.title) like LOWER('%${title}%')` : '';
    const sectionKeyFilter = ` AND SurveySummary.sectionkey = '${sectionkey}'`;
    const surveyKeyFilter = surveykey ? ` AND SurveySummary.surveykey = ${surveykey}` : '';

    return this.BuzzRepository.createQueryBuilder('SurveySummary')
      .where(`SurveySummary.staffkey = '${staffkey}' ${sectionKeyFilter} ${surveyTitleFilter} ${surveyKeyFilter}`)
      .getMany();
  }

  async findQuestionsBySurvey(surveykey: number): Promise<SurveySummaryQuestionsEntity[]> {
    return this.BuzzQuestionsRepository.createQueryBuilder('SurveySummaryQuestions')
      .leftJoin(SurveySummaryEntity, 'ss', `SurveySummaryQuestions.surveykey = ss.surveykey and ss.surveykey='${surveykey}'`)
      .where({ surveykey })
      .getMany();
  }
}
