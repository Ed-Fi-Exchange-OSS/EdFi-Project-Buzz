// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import SchoolEntity from '../entities/school.entity';
import SectionEntity from '../entities/section.entity';
import StudentEntity from '../entities/studentsection.entity';

@Injectable()
export default class SchoolService {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    @InjectRepository(SchoolEntity) private readonly BuzzRepository: Repository<SchoolEntity>,
    @InjectRepository(SectionEntity) private readonly BuzzSectionRepository: Repository<SectionEntity>,
    @InjectRepository(StudentEntity) private readonly BuzzStudentRepository: Repository<StudentEntity>,
  ) {}

  async findAll(): Promise<SchoolEntity[]> {
    return this.BuzzRepository.find();
  }

  async findOneById(id: string): Promise<SchoolEntity> {
    return this.BuzzRepository.findOne({ where: { schoolkey: id } });
  }

  async findSectionsBySchool(schoolkey: string): Promise<SectionEntity[]> {
    return this.BuzzSectionRepository.createQueryBuilder('section')
      .innerJoin(SchoolEntity, 'school', `section.schoolkey = school.schoolkey and school.schoolkey='${schoolkey}'`)
      .getMany();
  }

  async findStudentsBySchool(schoolkey: string): Promise<StudentEntity[]> {
    return this.BuzzStudentRepository.createQueryBuilder('student')
      .innerJoin(SchoolEntity, 'school', `student.schoolkey = school.schoolkey and school.schoolkey='${schoolkey}'`)
      .getMany();
  }
}
