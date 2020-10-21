// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  SurveySummaryQuestionsEntity,
  SurveySummaryAnswersEntity,
} from '../entities/buzz';
import { BUZZ_DATABASE } from '../../constants';

@Injectable()
export default class SurveySummaryQuestionsService {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    @InjectRepository(SurveySummaryQuestionsEntity, BUZZ_DATABASE)
    private readonly BuzzRepository: Repository<SurveySummaryQuestionsEntity>,
    @InjectRepository(SurveySummaryAnswersEntity, BUZZ_DATABASE)
    private readonly BuzzAnswersRepository: Repository<SurveySummaryAnswersEntity>,
  ) {}

  async findAll(): Promise<SurveySummaryQuestionsEntity[]> {
    return this.BuzzRepository.find();
  }

  async findAnswersByQuestion(sectionkey: string, surveyquestionkey: number): Promise<SurveySummaryAnswersEntity[]> {
    return this.BuzzAnswersRepository.createQueryBuilder('SurveySummaryAnswers')
      .leftJoin(SurveySummaryQuestionsEntity, 'ss', 'SurveySummaryAnswers.surveyquestionkey = ss.surveyquestionkey')
      .where({ sectionkey, surveyquestionkey })
      .getMany();
  }
}
