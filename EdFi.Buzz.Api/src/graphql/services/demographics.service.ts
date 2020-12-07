// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BUZZ_DATABASE } from 'src/constants';
import { Repository } from 'typeorm';
import {
  DemographicsEntity,
  DemographicsTypeEntity,
  StudentDemographicsEntity,
} from '../entities/buzz';

@Injectable()
export default class DemographicsService {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    @InjectRepository(DemographicsEntity, BUZZ_DATABASE)
    private readonly DemographicsRepository: Repository<DemographicsEntity>,
  ) {}

  async findByStudentSchool(studentschoolkey: string, type: string): Promise<DemographicsEntity[]> {
    return this.DemographicsRepository.createQueryBuilder('demographics')
      .innerJoin(
        DemographicsTypeEntity,
        'demographicstype',
        `demographicstype.demographicstypekey = demographics.demographicstypekey and demographicstype.type = '${type}'`,
      )
      .innerJoin(
        StudentDemographicsEntity,
        'studentdemographics',
        'demographics.demographicskey = studentdemographics.demographicskey',
      )
      .where(`studentdemographics.studentschoolkey = '${studentschoolkey}' `)
      .getMany();
  }
}
