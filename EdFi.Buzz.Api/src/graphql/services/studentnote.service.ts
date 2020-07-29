// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import StudentNoteEntity from '../entities/studentnote.entity';

@Injectable()
export default class StudentNoteService {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    @InjectRepository(StudentNoteEntity) private readonly BuzzStudentNotesRepository: Repository<StudentNoteEntity>,
  ) {}

  async addStudentNote(note: StudentNoteEntity): Promise<StudentNoteEntity> {
    return this.BuzzStudentNotesRepository.save(note);
  }

  async deleteStudentNote(note: StudentNoteEntity): Promise<StudentNoteEntity> {
    const d = new Date();
    const datestring = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    const noteToDelete = await this.BuzzStudentNotesRepository.findOne(note.studentnotekey);
    noteToDelete.deletedby = note.deletedby;
    noteToDelete.deletedat = datestring;
    return this.BuzzStudentNotesRepository.save(noteToDelete);
  }
}
