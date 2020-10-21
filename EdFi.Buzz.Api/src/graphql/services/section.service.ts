// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SectionEntity, StudentSectionEntity, StudentSchoolEntity } from '../entities/buzz';
import { BUZZ_DATABASE } from '../../constants';

@Injectable()
export default class SectionService {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    @InjectRepository(SectionEntity, BUZZ_DATABASE) private readonly BuzzRepository: Repository<SectionEntity>,
    @InjectRepository(StudentSchoolEntity, BUZZ_DATABASE)
    private readonly BuzzStudentSchoolRepository: Repository<StudentSchoolEntity>,
  ) {}

  async findAll(): Promise<SectionEntity[]> {
    return this.BuzzRepository.find();
  }

  async findOneById(id: string): Promise<SectionEntity> {
    return this.BuzzRepository.findOne({ where: { sectionkey: id } });
  }

  async findStudentBySection(sectionkey: string, studentschoolkey: string): Promise<StudentSchoolEntity> {
    return this.BuzzStudentSchoolRepository.createQueryBuilder('student')
      .innerJoin(StudentSectionEntity, 'ss', 'student.studentschoolkey = ss.studentschoolkey')
      .where(`ss.studentschoolkey='${studentschoolkey}' and ss.sectionkey='${sectionkey}'`)
      .getOne();
  }

  async findStudentsBySection(sectionkey: string): Promise<StudentSchoolEntity[]> {
    return this.BuzzStudentSchoolRepository.createQueryBuilder('student')
      .innerJoin(
        StudentSectionEntity,
        'ss',
        `student.studentschoolkey = ss.studentschoolkey and ss.sectionkey='${sectionkey}'`,
      )
      .getMany();
  }
}
