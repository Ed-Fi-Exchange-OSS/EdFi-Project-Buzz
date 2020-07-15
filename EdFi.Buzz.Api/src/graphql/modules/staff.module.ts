// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import StaffResolvers from '../resolvers/staff.resolver';
import StaffService from '../services/staff.service';
import StaffEntity from '../entities/staff.entity';
import SectionEntity from '../entities/section.entity';
import StudentEntity from '../entities/studentschool.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StaffEntity, SectionEntity, StudentEntity])],
  providers: [StaffService, StaffResolvers],
})
export default class StaffModule {}
