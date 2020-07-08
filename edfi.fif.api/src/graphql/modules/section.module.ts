// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import SectionResolvers from '../resolvers/section.resolver';
import SectionService from '../services/section.service';
import SectionEntity from '../entities/section.entity';
import StudentSchoolEntity from '../entities/studentschool.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SectionEntity, StudentSchoolEntity])],
  providers: [SectionService, SectionResolvers],
})
export default class SectionModule {}
