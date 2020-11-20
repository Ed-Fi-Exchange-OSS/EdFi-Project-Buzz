// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AttendanceEntity } from '../entities/buzz';
import { BUZZ_DATABASE } from '../../constants';

@Injectable()
export default class AttendanceService {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    @InjectRepository(AttendanceEntity, BUZZ_DATABASE)
    private readonly BuzzRepository: Repository<AttendanceEntity>,
  ) {}

  async findAll(): Promise<AttendanceEntity[]> {
    return this.BuzzRepository.find();
  }

  async findOneByStudentSchool(id: string): Promise<AttendanceEntity> {
    return this.BuzzRepository.findOne({ where: { studentschoolkey: id } });
  }
}
