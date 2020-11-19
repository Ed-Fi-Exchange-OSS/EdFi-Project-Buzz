// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { UseGuards } from '@nestjs/common';
import {
  Parent, Args, Resolver, ResolveProperty,
} from '@nestjs/graphql';
import {
  StudentSchool, ContactPerson, StudentSurvey, StudentNote,
} from '../graphql.schema';
import StudentSchoolService from '../services/studentschool.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('google'))
@Resolver('StudentSchool')
export default class StudentSchoolResolvers {
  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly studentschoolService: StudentSchoolService) {}

  // @Query()
  async students(): Promise<StudentSchool[]> {
    return this.studentschoolService.findAll();
  }

  async findOneById(
    @Args('studentschoolkey') studentschoolkey: string,
  ): Promise<StudentSchool> {
    return this.studentschoolService.findOneById(studentschoolkey);
  }

  @ResolveProperty('contacts')
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async contacts(@Parent() parent): Promise<ContactPerson[]> {
    return this.studentschoolService.findStudentContactsById(parent.studentschoolkey);
  }

  @ResolveProperty('siblingscount')
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async siblingscount(@Parent() parent): Promise<number> {
    const studentList = this.studentschoolService.findStudentsSiblings(parent.studentschoolkey);
    return studentList && studentList !== undefined ? (await studentList).length : 0;
  }

  @ResolveProperty('siblings')
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async siblings(@Parent() parent): Promise<ContactPerson[]> {
    return this.studentschoolService.findStudentsSiblings(parent.studentschoolkey);
  }

  @ResolveProperty('schoolname')
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async schoolname(@Parent() parent): Promise<string> {
    const result = await this.studentschoolService.findOneSchoolByStudent(parent.schoolkey);
    return result && result !== undefined ? result.schoolname : '';
  }

  @ResolveProperty('studentsurveys')
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async studentsurveys(@Parent() parent): Promise<StudentSurvey[]> {
    return this.studentschoolService.findByStudentSchoolKey(parent.studentschoolkey);
  }

  @ResolveProperty('notes')
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async studentnotes(@Parent() parent): Promise<StudentNote[]> {
    return this.studentschoolService.findStudentNotesByStudentSchoolKey(parent.studentschoolkey);
  }
}
