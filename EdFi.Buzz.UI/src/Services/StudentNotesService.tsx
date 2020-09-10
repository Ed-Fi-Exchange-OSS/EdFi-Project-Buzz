// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { addStudentNote, deleteStudentNote } from './GraphQL/StudentNotesMutations';
import { StudentNote } from '../Models';

export default class StudentNotesApiService {

  /* eslint no-useless-constructor: "off"*/
  constructor(private apolloClient: ApolloClient<InMemoryCache>) { }

  public addStudentNote = (staffKey: number, studentSchoolKey: string, note: string): Promise<StudentNote> => {
    const client = this.apolloClient;
    return client.mutate({ mutation: addStudentNote, variables: { staffkey: staffKey , studentschoolkey: studentSchoolKey, note } })
      .then(result =>  result.data.addstudentnote );
  };

  public deleteStudentNote = async (staffKey: number, studentnotekey: number): Promise<StudentNote> => {
    const client = this.apolloClient;
    return client.mutate({ mutation: deleteStudentNote, variables: { staffkey: staffKey , studentnotekey } })
      .then(result =>  result.data.deleteStudentNote);
  };
}
