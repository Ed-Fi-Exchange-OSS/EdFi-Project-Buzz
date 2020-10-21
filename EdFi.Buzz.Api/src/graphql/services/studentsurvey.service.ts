// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  SurveyEntity,
  StudentSurveyEntity,
  AnswersByStudentEntity,
} from '../entities/buzz';
import { BUZZ_DATABASE } from '../../constants';

@Injectable()
export default class StudentSurveyService {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    @InjectRepository(SurveyEntity, BUZZ_DATABASE) private readonly BuzzSurveyRepository: Repository<SurveyEntity>,
    @InjectRepository(AnswersByStudentEntity, BUZZ_DATABASE)
    private readonly BuzzAnswersByStudentRepository: Repository<AnswersByStudentEntity>,
  ) {}

  async findSurvey(surveykey: string): Promise<SurveyEntity> {
    return this.BuzzSurveyRepository.findOne({ where: { surveykey, deletedat: null } });
  }

  async findAnwsersByStudent(surveykey: number, studentschoolkey: string): Promise<AnswersByStudentEntity[]> {
    return this.BuzzAnswersByStudentRepository.createQueryBuilder('AnswersByStudent')
      .innerJoin(
        StudentSurveyEntity,
        'ss',
        `AnswersByStudent.surveykey = ss.surveykey and ss.surveykey='${surveykey}'
          and AnswersByStudent.studentschoolkey = ss.studentschoolkey and ss.studentschoolkey='${studentschoolkey}'`,
      )
      .innerJoin(
        SurveyEntity,
        'se',
        'ss.surveykey = se.surveykey and se.deletedat IS NULL',
      )
      .getMany();
  }
}
