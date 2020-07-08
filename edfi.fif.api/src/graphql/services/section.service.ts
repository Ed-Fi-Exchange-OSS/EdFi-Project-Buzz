// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import SectionEntity from '../entities/section.entity';
import StudentSectionEntity from '../entities/studentsection.entity';
import StudentSchoolEntity from '../entities/studentschool.entity';

@Injectable()
export default class SectionService {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    @InjectRepository(SectionEntity) private readonly FixItFridayRepository: Repository<SectionEntity>,
    @InjectRepository(StudentSchoolEntity)
    private readonly FixItFridayStudentSchoolRepository: Repository<StudentSchoolEntity>,
  ) {}

  async findAll(): Promise<SectionEntity[]> {
    return this.FixItFridayRepository.find();
  }

  async findOneById(id: string): Promise<SectionEntity> {
    return this.FixItFridayRepository.findOne({ where: { sectionkey: id } });
  }

  async findStudentBySection(sectionkey: string, studentschoolkey: string): Promise<StudentSchoolEntity> {
    return this.FixItFridayStudentSchoolRepository.createQueryBuilder('student')
      .innerJoin(StudentSectionEntity, 'ss', `student.studentschoolkey = ss.studentschoolkey`)
      .where(`ss.studentschoolkey='${studentschoolkey}' and ss.sectionkey='${sectionkey}'`)
      .getOne();
  }

  async findStudentsBySection(sectionkey: string): Promise<StudentSchoolEntity[]> {
    return this.FixItFridayStudentSchoolRepository.createQueryBuilder('student')
      .innerJoin(
        StudentSectionEntity,
        'ss',
        `student.studentschoolkey = ss.studentschoolkey and ss.sectionkey='${sectionkey}'`,
      )
      .getMany();
  }
}
