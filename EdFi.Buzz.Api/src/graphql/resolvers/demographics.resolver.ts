// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { UseGuards } from '@nestjs/common';
import {
  Args, Resolver, Query,
} from '@nestjs/graphql';
import { Demographics } from '../graphql.schema';
import DemographicsService from '../services/demographics.service';
import AuthGuard from '../auth.guard';

@UseGuards(AuthGuard)
@Resolver('Demographics')
export default class DemographicsResolvers {
  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly demographicsService: DemographicsService) {}

  @Query('studentcharacteristicsbystudentschool')
  async findCharacteristicsByStudentSchool(
    @Args('studentschoolkey') studentschoolkey: string,
  ): Promise<Demographics[]> {
    return this.demographicsService.findByStudentSchool(studentschoolkey, 'Characteristics');
  }

  @Query('studentprogramsbystudentschool')
  async findProgramsByStudentSchool(
    @Args('studentschoolkey') studentschoolkey: string,
  ): Promise<Demographics[]> {
    return this.demographicsService.findByStudentSchool(studentschoolkey, 'Programs');
  }
}
