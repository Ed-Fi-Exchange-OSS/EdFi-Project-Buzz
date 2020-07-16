// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { addStudentNote } from './GraphQL/StudentNotesMutations';
import { StudentNote } from '../Models';

@Injectable({ providedIn: 'root' })
export class StudentNotesApiService {
  controllerName = 'studentNotes';


  constructor(private apollo: Apollo) { }

  async addStudentNote(staffKey: number, studentSchoolKey: string, note: string): Promise<StudentNote> {
    const client = this.apollo.getClient();
    return client.mutate({ mutation: addStudentNote, variables: { staffkey: staffKey , studentschoolkey: studentSchoolKey, note: note } })
      .then(result =>  result.data.addstudentnote );
  }

}
