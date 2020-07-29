// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import SurveyStatusEntity from '../entities/survey/surveystatus.entity';

@Injectable()
export default class SurveyStatusService {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    @InjectRepository(SurveyStatusEntity) private readonly BuzzRepository: Repository<SurveyStatusEntity>,
  ) {}

  async find(staffkey: number, jobkey: string): Promise<SurveyStatusEntity[]> {
    if (jobkey) {
      return this.BuzzRepository.find({ where: { staffkey, jobkey } });
    }

    return this.BuzzRepository.find({ where: { staffkey } });
  }

  async addSurveyStatus(SurveyStatus: SurveyStatusEntity): Promise<SurveyStatusEntity> {
    return this.BuzzRepository.save(SurveyStatus);
  }
}
