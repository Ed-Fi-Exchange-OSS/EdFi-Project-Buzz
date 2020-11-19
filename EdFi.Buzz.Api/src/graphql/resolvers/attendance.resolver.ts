// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { UseGuards } from '@nestjs/common';
import {
  Args, Resolver, Query,
} from '@nestjs/graphql';
import { Attendance } from '../graphql.schema';
import AttendanceService from '../services/attendance.service';
import AuthGuard from '../auth.guard';

@UseGuards(AuthGuard)
@Resolver('Attendance')
export default class AttendanceResolvers {
  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly attendanceService: AttendanceService) {}

  async attendance(): Promise<Attendance[]> {
    return this.attendanceService.findAll();
  }
  @Query('attendancebystudentschool')
  async findOneByStudentSchool(@Args('studentschoolkey') studentschoolkey: string): Promise<Attendance> {
    return this.attendanceService.findOneByStudentSchool(studentschoolkey);
  }
}
