// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  Args, Resolver, Query, ResolveProperty, Parent,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { JobStatus } from '../graphql.schema';
import AuthGuard from '../auth.guard';
import ValidateStaffIdGuard from '../guards/validateStaffId.guard';
import SurveyStatusService from '../services/surveystatus.service';
import { SurveyStatusEntity } from '../entities/buzz';

@UseGuards(AuthGuard)
@UseGuards(ValidateStaffIdGuard)
@Resolver('SurveyStatus')
export default class SurveyStatusResolvers {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    private readonly surveyStatusService: SurveyStatusService,
  ) {}

  @Query('surveystatus')
  async staffById(
    @Args('staffkey', { nullable: false }) staffkey: number,
      @Args('jobkey', { nullable: true }) jobkey: string,
  ): Promise<SurveyStatusEntity[]> {
    return this.surveyStatusService.find(staffkey, jobkey);
  }

  @ResolveProperty('jobstatus')
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async jobstatus(@Parent() parent): Promise<JobStatus> {
    return this.surveyStatusService.findJobStatusByJobStatusKey(parent.jobstatuskey);
  }
}
