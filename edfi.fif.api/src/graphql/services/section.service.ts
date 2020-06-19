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

  async findStudentsBySection(sectionkey: string): Promise<StudentSchoolEntity[]> {
    return this.FixItFridayStudentSchoolRepository.createQueryBuilder('student')
      .leftJoin(
        StudentSectionEntity,
        'ss',
        `student.studentschoolkey = ss.studentschoolkey and ss.sectionkey='${sectionkey}'`,
      )
      .getMany();
  }
}
