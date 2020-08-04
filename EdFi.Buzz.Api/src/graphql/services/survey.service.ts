// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import SurveyEntity from '../entities/survey/survey.entity';
import SurveyQuestionEntity from '../entities/survey/surveyquestion.entity';

@Injectable()
export default class SurveyService {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    @InjectRepository(SurveyEntity) private readonly BuzzRepository: Repository<SurveyEntity>,
    @InjectRepository(SurveyQuestionEntity)
    private readonly BuzzQuestionsRepository: Repository<SurveyQuestionEntity>,
  ) {}

  async findAll(): Promise<SurveyEntity[]> {
    return this.BuzzRepository.find();
  }

  async findOneById(id: number): Promise<SurveyEntity> {
    return this.BuzzRepository.findOne({ where: { surveykey: id } });
  }

  async findQuestionBySurveyKey(surveykey: number): Promise<SurveyQuestionEntity[]> {
    return this.BuzzQuestionsRepository.createQueryBuilder('Questions')
      .innerJoin(SurveyEntity, 's', `Questions.surveykey = s.surveykey and s.surveykey=${surveykey}`)
      .where({ surveykey })
      .getMany();
  }
}
