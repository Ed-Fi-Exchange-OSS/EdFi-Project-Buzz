// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BUZZ_DATABASE } from 'src/constants';
import { Repository } from 'typeorm';
import StudentAssessmentEntity from '../entities/buzz/studentassessment.entity';

@Injectable()
export default class AssessmentService {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    @InjectRepository(StudentAssessmentEntity, BUZZ_DATABASE)
    private readonly BuzzRepository: Repository<StudentAssessmentEntity>,
  ) {}

  async findAll(): Promise<StudentAssessmentEntity[]> {
    return this.BuzzRepository.find();
  }

  async findByStudentSchool(id: string): Promise<StudentAssessmentEntity[]> {
    return this.BuzzRepository.createQueryBuilder('studentassessment')
      .where({ studentschoolkey: id }).getMany();
  }
}
