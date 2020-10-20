// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SchoolEntity, SectionEntity, StudentSchoolEntity } from '../entities/buzz';
import { BUZZ_DATABASE } from '../../constants';

@Injectable()
export default class SchoolService {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    @InjectRepository(SchoolEntity, BUZZ_DATABASE)
    private readonly BuzzRepository: Repository<SchoolEntity>,
    @InjectRepository(SectionEntity, BUZZ_DATABASE)
    private readonly BuzzSectionRepository: Repository<SectionEntity>,
    @InjectRepository(StudentSchoolEntity, BUZZ_DATABASE)
    private readonly BuzzStudentRepository: Repository<StudentSchoolEntity>,
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

  async findStudentsBySchool(schoolkey: string): Promise<StudentSchoolEntity[]> {
    return this.BuzzStudentRepository.createQueryBuilder('student')
      .innerJoin(SchoolEntity, 'school', `student.schoolkey = school.schoolkey and school.schoolkey='${schoolkey}'`)
      .getMany();
  }
}
