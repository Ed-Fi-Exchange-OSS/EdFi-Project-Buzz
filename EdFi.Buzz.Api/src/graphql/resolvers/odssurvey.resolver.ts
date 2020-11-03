// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { UseGuards } from '@nestjs/common';
import {
  Args, Query, Resolver,
} from '@nestjs/graphql';
import { OdsSurvey, CanLoadSurverysFromUI } from '../graphql.schema';
import OdsSurveyService from '../services/odssurvey.service';
import AuthGuard from '../auth.guard';
import { DoesOdsContainsSurveyModel } from '../entities/buzz';

@UseGuards(AuthGuard)
@Resolver('OdsSurvey')
export default class SectionResolvers {
  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly odsSurveyService: OdsSurveyService) {}

  @Query('odssurveys')
  async odsSurveys(): Promise<OdsSurvey[]> {
    return this.odsSurveyService.findAll();
  }

  @Query('odssurveybyid')
  async findOneById(@Args('surveyidentifier') surveyIdentifier: string): Promise<OdsSurvey> {
    return this.odsSurveyService.findOneById(surveyIdentifier);
  }

  @Query('canLoadSurverysFromUI')
  async canLoadSurverysFromUI(
  ): Promise<CanLoadSurverysFromUI> {
    return this.odsSurveyService.canLoadSurverysFromUI();
  }

  @Query('doesOdsContainsSurveyModel')
  async doesOdsContainsSurveyModel(
  ): Promise<DoesOdsContainsSurveyModel> {
    return this.odsSurveyService.doesOdsContainsSurveyModel();
  }
}
