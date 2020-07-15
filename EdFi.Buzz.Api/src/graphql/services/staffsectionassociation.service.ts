// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import StaffSectionAssociationEntity from '../entities/staffsectionassociation.entity';

@Injectable()
export default class StaffSectionAssociationService {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    @InjectRepository(StaffSectionAssociationEntity)
    private readonly BuzzRepository: Repository<StaffSectionAssociationEntity>,
  ) {}

  async findAll(): Promise<StaffSectionAssociationEntity[]> {
    return this.BuzzRepository.find();
  }

  async findOneById(id: string): Promise<StaffSectionAssociationEntity> {
    return this.BuzzRepository.findOne({ where: { staffkey: id } });
  }
}
