// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import ContactPersonEntity from '../entities/contactperson.entity';
import SchoolEntity from '../entities/school.entity';
import StudentSchoolEntity from '../entities/studentschool.entity';
import StudentContactEntity from '../entities/studentcontact.entity';
import StudentSurveyEntity from '../entities/survey/studentsurvey.entity';
import StudentNoteEntity from '../entities/studentnote.entity';

@Injectable()
export default class SectionService {
  fatherText = 'Father';

  motherText = 'Mother';

  // eslint-disable-next-line no-useless-constructor
  constructor(
    @InjectRepository(StudentSchoolEntity) private readonly BuzzRepository: Repository<StudentSchoolEntity>,
    @InjectRepository(ContactPersonEntity) private readonly BuzzRepositoryContacts: Repository<ContactPersonEntity>,
    @InjectRepository(SchoolEntity) private readonly BuzzRepositorySchool: Repository<SchoolEntity>,
    @InjectRepository(StudentSurveyEntity)
    private readonly BuzzStudentSurveyRepository: Repository<StudentSurveyEntity>,
    @InjectRepository(StudentNoteEntity) private readonly BuzzStudentNotesRepository: Repository<StudentNoteEntity>,
  ) {}

  async findAll(): Promise<StudentSchoolEntity[]> {
    return this.BuzzRepository.find();
  }

  async findAllBySection(id: string): Promise<StudentSchoolEntity[]> {
    return this.BuzzRepository.createQueryBuilder('section')
      .innerJoin(StudentSchoolEntity, 'ss', 'ss.sectionkey = section.sectionkey')
      .innerJoinAndSelect('section.students', 'student', 'student.studentschoolkey = ss.studentschoolkey')
      .where({ sectionkey: id })
      .getMany();
  }

  async findOneById(id: string): Promise<StudentSchoolEntity> {
    return this.BuzzRepository.findOne({ where: { studentschoolkey: id } });
  }

  async findStudentContactsById(studentschoolkey: string): Promise<ContactPersonEntity[]> {
    return this.BuzzRepositoryContacts.createQueryBuilder('contactperson')
      .innerJoin(
        StudentContactEntity,
        'sc',
        `contactperson.uniquekey = sc.contactkey and sc.studentschoolkey='${studentschoolkey}'`,
      )
      .getMany();
  }

  async findStudentsSiblings(studentschoolkey: string): Promise<StudentSchoolEntity[]> {
    return this.BuzzRepository.createQueryBuilder('students')
      .innerJoin(
        StudentContactEntity,
        'siblingcontact',
        `students.studentschoolkey = siblingcontact.studentschoolkey and siblingcontact.studentschoolkey NOT IN ('${studentschoolkey}')`,
      )
      .innerJoin(
        ContactPersonEntity,
        'cpsibling',
        'cpsibling.uniquekey = siblingcontact.contactkey and students.studentkey=cpsibling.studentkey',
      )
      .innerJoin(ContactPersonEntity, 'cpcurrentstudent', 'cpcurrentstudent.contactpersonkey = cpsibling.contactpersonkey')
      .innerJoin(
        StudentContactEntity,
        'currentstudentcontact',
        `currentstudentcontact.studentschoolkey = '${studentschoolkey}' AND cpcurrentstudent.uniquekey = currentstudentcontact.contactkey`,
      )
      .where(
        '(cpcurrentstudent.RelationshipToStudent like :father or cpcurrentstudent.RelationshipToStudent like :mother) AND (cpsibling.RelationshipToStudent like :father or cpsibling.RelationshipToStudent like :mother)',
        { father: `${this.fatherText}%`, mother: `${this.motherText}%` },
      )
      .getMany();
  }

  async findOneSchoolByStudent(id: string): Promise<SchoolEntity> {
    return this.BuzzRepositorySchool.findOne({ where: { schoolkey: id } });
  }

  async findByStudentSchoolKey(studentschoolkey: string): Promise<StudentSurveyEntity[]> {
    return this.BuzzStudentSurveyRepository.createQueryBuilder('studentsurvey')
      .innerJoin(
        StudentSchoolEntity,
        'ss',
        `studentsurvey.studentschoolkey = ss.studentschoolkey and ss.studentschoolkey='${studentschoolkey}'`,
      )
      .where({ studentschoolkey })
      .getMany();
  }

  async findStudentNotesByStudentSchoolKey(studentschoolkey: string): Promise<StudentNoteEntity[]> {
    return this.BuzzStudentNotesRepository.createQueryBuilder('studentnotes')
      .innerJoin(
        StudentSchoolEntity,
        'ss',
        `studentnotes.studentschoolkey = ss.studentschoolkey and ss.studentschoolkey='${studentschoolkey}'`,
      )
      .where('(studentnotes.deletedat IS NULL)')
      .orderBy('studentnotekey', 'DESC')
      .getMany();
  }
}
