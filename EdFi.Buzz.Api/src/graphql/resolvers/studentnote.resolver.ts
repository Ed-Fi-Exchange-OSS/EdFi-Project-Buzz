// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { UseGuards } from '@nestjs/common';
import { Args, Resolver, Mutation } from '@nestjs/graphql';
import { StudentNote } from '../graphql.schema';
import StudentNoteService from '../services/studentnote.service';
import AuthGuard from '../auth.guard';

@UseGuards(AuthGuard)
@Resolver('StudentNote')
export default class StudentNoteResolvers {
  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly studentNoteService: StudentNoteService) {}

  @Mutation('addstudentnote')
  async addstudentnote(@Args('staffkey') staffkey: number,
    @Args('studentschoolkey') studentschoolkey: string,
    @Args('note') note: string): Promise<StudentNote> {
    return this.studentNoteService.addStudentNote({
      studentnotekey: null,
      note,
      studentschoolkey,
      staffkey,
    });
  }

  @Mutation('deletestudentnote')
  async deletestudentnote(@Args('staffkey') staffkey: number,
    @Args('studentnotekey') studentnotekey: number): Promise<StudentNote> {
    const deletedby = staffkey;
    return this.studentNoteService.deleteStudentNote({
      studentnotekey,
      note: null,
      studentschoolkey: null,
      staffkey: null,
      deletedby,
    });
  }
}
