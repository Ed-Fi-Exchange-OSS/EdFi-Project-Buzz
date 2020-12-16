// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { UseGuards } from '@nestjs/common';
import {
  Parent, Args, Resolver, ResolveField,
} from '@nestjs/graphql';
import {
  StudentSchool,
  ContactPerson,
  StudentSurvey,
  StudentNote,
  Attendance,
  Demographics,
} from '../graphql.schema';
import StudentSchoolService from '../services/studentschool.service';
import DemographicsService from '../services/demographics.service';
import AuthGuard from '../auth.guard';

@UseGuards(AuthGuard)
@Resolver('StudentSchool')
export default class StudentSchoolResolvers {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    private readonly studentschoolService: StudentSchoolService,
    private readonly demographicsService: DemographicsService,
  ) {}

  // @Query()
  async students(): Promise<StudentSchool[]> {
    return this.studentschoolService.findAll();
  }

  async findOneById(
    @Args('studentschoolkey') studentschoolkey: string,
  ): Promise<StudentSchool> {
    return this.studentschoolService.findOneById(studentschoolkey);
  }

  @ResolveField('contacts')
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async contacts(@Parent() parent): Promise<ContactPerson[]> {
    return this.studentschoolService.findStudentContactsById(parent.studentschoolkey);
  }

  @ResolveField('siblingscount')
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async siblingscount(@Parent() parent): Promise<number> {
    const studentList = this.studentschoolService.findStudentsSiblings(parent.studentschoolkey);
    return studentList && studentList !== undefined ? (await studentList).length : 0;
  }

  @ResolveField('siblings')
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async siblings(@Parent() parent): Promise<ContactPerson[]> {
    return this.studentschoolService.findStudentsSiblings(parent.studentschoolkey);
  }

  @ResolveField('schoolname')
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async schoolname(@Parent() parent): Promise<string> {
    const result = await this.studentschoolService.findOneSchoolByStudent(parent.schoolkey);
    return result && result !== undefined ? result.schoolname : '';
  }

  @ResolveField('studentsurveys')
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async studentsurveys(@Parent() parent): Promise<StudentSurvey[]> {
    return this.studentschoolService.findByStudentSchoolKey(parent.studentschoolkey);
  }

  @ResolveField('notes')
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async studentnotes(@Parent() parent): Promise<StudentNote[]> {
    return this.studentschoolService.findStudentNotesByStudentSchoolKey(parent.studentschoolkey);
  }

  @ResolveField('attendance')
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async studentattendance(@Parent() parent): Promise<Attendance> {
    return this.studentschoolService.findAttendanceByStudentSchoolKey(parent.studentschoolkey);
  }

  @ResolveField('characteristics')
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async studentatcharacteristics(@Parent() parent): Promise<Demographics[]> {
    return this.demographicsService.findByStudentSchool(parent.studentschoolkey, 'Characteristics');
  }

  @ResolveField('programs')
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async studentatprograms(@Parent() parent): Promise<Demographics[]> {
    return this.demographicsService.findByStudentSchool(parent.studentschoolkey, 'Programs');
  }
}
