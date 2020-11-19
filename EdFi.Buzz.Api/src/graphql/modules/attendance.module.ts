// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import AttendanceResolvers from '../resolvers/attendance.resolver';
import AttendanceService from '../services/attendance.service';
import {
  AttendanceEntity,
} from '../entities/buzz';
import { BUZZ_DATABASE } from '../../constants';

@Module({
  imports: [TypeOrmModule.forFeature([AttendanceEntity], BUZZ_DATABASE)],
  providers: [AttendanceService, AttendanceResolvers],
})
export default class AttendanceModule {}
