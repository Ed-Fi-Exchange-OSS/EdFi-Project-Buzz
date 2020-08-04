// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import SurveyStatusEntity from '../entities/survey/surveystatus.entity';
import JobStatusEntity from '../entities/survey/jobstatus.entity';
import SurveyEntity from '../entities/survey/survey.entity';

@Injectable()
export default class SurveyStatusService {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    @InjectRepository(SurveyStatusEntity) private readonly BuzzRepository: Repository<SurveyStatusEntity>,
    @InjectRepository(JobStatusEntity) private readonly BuzzJobStatusRepository: Repository<JobStatusEntity>,
  ) {}

  async find(staffkey: number, jobkey: string): Promise<SurveyStatusEntity[]> {
    if (jobkey) {
      return this.BuzzRepository.createQueryBuilder('SurveyStatus')
      .innerJoin(
        SurveyEntity,
        'se',
        `SurveyStatus.surveykey = se.surveykey AND se.deletedat IS NULL`
      )
      .where(`SurveyStatus.staffkey=${staffkey} AND SurveyStatus.jobkey='${jobkey}'`)
      .getMany();

      //return this.BuzzRepository.find({ where: { staffkey, jobkey } });
    }

    
    return this.BuzzRepository.createQueryBuilder('SurveyStatus')
    .innerJoin(
      SurveyEntity,
      'se',
      `SurveyStatus.surveykey = se.surveykey  AND se.deletedat IS NULL`
    )
    .where(`SurveyStatus.staffkey=${staffkey}`)
    .getMany();

    //return this.BuzzRepository.find({ where: { staffkey } });
  }

  async findJobStatusByJobStatusKey(jobstatus: number): Promise<JobStatusEntity> {
    return this.BuzzJobStatusRepository.createQueryBuilder('jobstatus')
      .innerJoin(SurveyStatusEntity, 'sse', 'jobstatus.jobstatuskey = sse.jobstatuskey')
      .where(`jobstatus.jobstatuskey=${jobstatus}`)
      .getOne();
  }

  async addSurveyStatus(SurveyStatus: SurveyStatusEntity): Promise<SurveyStatusEntity> {
    return this.BuzzRepository.save(SurveyStatus);
  }
}
