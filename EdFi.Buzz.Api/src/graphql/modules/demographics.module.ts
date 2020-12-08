// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import DemographicsResolvers from '../resolvers/demographics.resolver';
import DemographicsService from '../services/demographics.service';
import {
  DemographicsEntity,
  DemographicsTypeEntity,
  StudentDemographicsEntity,
} from '../entities/buzz';
import { BUZZ_DATABASE } from '../../constants';

@Module({
  imports: [TypeOrmModule.forFeature([
    DemographicsEntity,
    DemographicsTypeEntity,
    StudentDemographicsEntity,
  ], BUZZ_DATABASE)],
  providers: [DemographicsService, DemographicsResolvers],
})
export default class DemographicsModule {}
