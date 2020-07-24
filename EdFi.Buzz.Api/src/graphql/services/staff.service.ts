// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import StudentEntity from '../entities/studentschool.entity';
import SectionEntity from '../entities/section.entity';
import StaffEntity from '../entities/staff.entity';
import StaffSectionAssociationEntity from '../entities/staffsectionassociation.entity';
import StudentSectionEntity from '../entities/studentsection.entity';

@Injectable()
export default class StaffService {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    @InjectRepository(StaffEntity) private readonly BuzzRepository: Repository<StaffEntity>,
    @InjectRepository(SectionEntity) private readonly BuzzSectionRepository: Repository<SectionEntity>,
    @InjectRepository(StudentEntity) private readonly BuzzStudentRepository: Repository<StudentEntity>,
  ) {}

  async findAll(): Promise<StaffEntity[]> {
    return this.BuzzRepository.find();
  }

  async findOneById(id: number): Promise<StaffEntity> {
    return this.BuzzRepository.findOne({ where: { staffkey: id } });
  }

  async findOneByEmail(staffmail: string): Promise<StaffEntity> {
    return this.BuzzRepository.findOne({ where: { electronicmailaddress: staffmail } });
  }

  async findSectionsByStaff(staffkey: number): Promise<SectionEntity[]> {
    return this.BuzzSectionRepository.createQueryBuilder('section')
      .innerJoin(StaffSectionAssociationEntity, 'ssa', `section.sectionkey = ssa.sectionkey and ssa.staffkey='${staffkey}'`)
      .getMany();
  }

  async findSectionByStaff(staffkey: number, sectionkey: string): Promise<SectionEntity> {
    return this.BuzzSectionRepository.createQueryBuilder('section')
      .innerJoin(StaffSectionAssociationEntity, 'ssa', 'section.sectionkey = ssa.sectionkey')
      .where(`section.sectionkey='${sectionkey}' and ssa.staffkey='${staffkey}'`)
      .getOne();
  }

  async findStudentsByStaff(staffkey: number): Promise<StudentEntity[]> {
    return this.BuzzStudentRepository.createQueryBuilder('student')
      .innerJoin(StudentSectionEntity, 'studentsection', 'studentsection.studentschoolkey = student.studentschoolkey')
      .innerJoin(
        StaffSectionAssociationEntity,
        'ssa',
        `studentsection.sectionkey = ssa.sectionkey and ssa.staffkey='${staffkey}'`,
      )
      .getMany();
  }

  async findStudentByStaff(staffkey: number, studentschoolkey: string): Promise<StudentEntity> {
    return this.BuzzStudentRepository.createQueryBuilder('student')
      .innerJoin(StudentSectionEntity, 'studentsection', 'studentsection.studentschoolkey = student.studentschoolkey')
      .innerJoin(
        StaffSectionAssociationEntity,
        'ssa',
        `studentsection.sectionkey = ssa.sectionkey and ssa.staffkey='${staffkey}'`,
      )
      .where(`student.studentschoolkey = '${studentschoolkey}' `)
      .getOne();
  }
}
