// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Injectable } from '@nestjs/common';
import { Repository, getManager } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OdsSurveyEntity } from '../entities/ods';
import { ODS_DATABASE } from '../../constants';
import { CanLoadSurverysFromUI, DoesOdsContainsSurveyModel } from '../entities/buzz';

@Injectable()
export default class OdsSurveyService {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    @InjectRepository(OdsSurveyEntity, ODS_DATABASE) private readonly OdsRepository: Repository<OdsSurveyEntity>,
  ) {}

  async findAll(): Promise<OdsSurveyEntity[]> {
    const result = this.OdsRepository
      .find()
      .catch(() => null);
    return result;
  }

  async findOneById(id: string): Promise<OdsSurveyEntity> {
    const result = this.OdsRepository
      .findOne({ where: { surveyidentifier: id } })
      .catch(() => null);
    return result;
  }

  // eslint-disable-next-line class-methods-use-this
  async canLoadSurverysFromUI(): Promise<CanLoadSurverysFromUI> {
    return {
      allowed: (process.env.KEEP_SURVEY_SYNCH.toLowerCase() === 'false'),
    };
  }

  // eslint-disable-next-line class-methods-use-this
  async doesOdsContainsSurveyModel(): Promise<DoesOdsContainsSurveyModel> {
    const OdsDsQuery = `
      IF (SELECT OBJECT_ID('edfi.survey')) IS NOT NULL
      BEGIN
          SELECT 'ds5' AS version
      END
      ELSE
      BEGIN
          SELECT 'InvalidDs' AS version
      END
    `;

    const result = await getManager().query(OdsDsQuery);

    return {
      contains: (result.toLowerCase() === 'ds5'),
    };
  }
}
