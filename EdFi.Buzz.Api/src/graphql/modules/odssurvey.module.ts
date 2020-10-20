// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import OdsSurveyResolver from '../resolvers/odssurvey.resolver';
import OdsSurveyService from '../services/odssurvey.service';
import { ODS_DATABASE } from '../../constants';
import
{ OdsSurveyEntity }
  from '../entities/ods';

@Module({
  imports: [TypeOrmModule.forFeature([OdsSurveyEntity], ODS_DATABASE)],
  providers: [OdsSurveyService, OdsSurveyResolver],
})
export default class OdsSurveyModule {}
