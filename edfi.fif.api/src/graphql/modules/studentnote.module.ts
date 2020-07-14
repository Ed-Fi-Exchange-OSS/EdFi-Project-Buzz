// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import StudentNoteResolvers from '../resolvers/studentnote.resolver';
import StudentNoteService from '../services/studentnote.service';
import StudentNoteEntity from '../entities/studentnote.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StudentNoteEntity])],
  providers: [StudentNoteService, StudentNoteResolvers],
})
export default class StudentNoteModule {}
