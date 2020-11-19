// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  Args, Parent, Query, Resolver, ResolveProperty,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { Staff, Section, StudentSchool } from '../graphql.schema';
import StaffService from '../services/staff.service';
import { AuthGuard } from '@nestjs/passport';
import ValidateStaffIdGuard from '../guards/validateStaffId.guard';
import CurrentUser from '../decorators/currentUser.decorator';

@UseGuards(AuthGuard('google'))
@Resolver('Staff')
export default class StaffResolvers {
  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly staffService: StaffService) {}

  @Query('staffbyemail')
  async staffByEmail(@CurrentUser() usermail: string): Promise<Staff> {
    return this.staffService.findOneByEmail(usermail);
  }

  @Query('staffbyid')
  // @UseGuards(ValidateStaffIdGuard)
  async staffById(@Args('staffkey') staffkey: number): Promise<Staff> {
    return this.staffService.findOneById(staffkey);
  }

  @Query('sectionbystaff')
  @UseGuards(ValidateStaffIdGuard)
  async findSectionByStaff(@Args('staffkey') staffkey: number,
    @Args('sectionkey') sectionkey: string): Promise<Section> {
    return this.staffService.findSectionByStaff(staffkey, sectionkey);
  }

  @Query('sectionsbystaff')
  @UseGuards(ValidateStaffIdGuard)
  async findSectionsByStaff(@Args('staffkey') staffkey: number): Promise<Section[]> {
    return this.staffService.findSectionsByStaff(staffkey);
  }

  @Query('studentsbystaff')
  @UseGuards(ValidateStaffIdGuard)
  async findStudentsByStaff(
    @Args('staffkey') staffkey: number,
  ): Promise<StudentSchool[]> {
    return this.staffService.findStudentsByStaff(staffkey);
  }

  @Query('studentbystaff')
  @UseGuards(ValidateStaffIdGuard)
  async findStudentByStaff(@Args('staffkey') staffkey: number,
    @Args('studentschoolkey') studentschoolkey: string): Promise<StudentSchool> {
    return this.staffService.findStudentByStaff(staffkey, studentschoolkey);
  }

  @ResolveProperty('sections')
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async sections(@Parent() parent): Promise<Section[]> {
    return this.staffService.findSectionsByStaff(parent.staffkey);
  }

  @ResolveProperty('section')
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async section(@Parent() parent,
    @Args('sectionkey') sectionkey: string): Promise<Section> {
    return this.staffService.findSectionByStaff(parent.staffkey, sectionkey);
  }
}
