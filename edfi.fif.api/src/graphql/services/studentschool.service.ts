import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import StudentSchoolEntity from '../entities/studentschool.entity';

@Injectable()
export default class SectionService {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    @InjectRepository(StudentSchoolEntity) private readonly FixItFridayRepository: Repository<StudentSchoolEntity>,
  ) {}

  async findAll(): Promise<StudentSchoolEntity[]> {
    return this.FixItFridayRepository.find();
  }

  async findAllBySection(id: string): Promise<StudentSchoolEntity[]> {
    return this.FixItFridayRepository.createQueryBuilder('section')
      .leftJoin(StudentSchoolEntity, 'ss', 'ss.sectionkey = section.sectionkey')
      .leftJoinAndSelect('section.students', 'student', 'student.studentschoolkey = ss.studentschoolkey')
      .where({ sectionkey: id })
      .getMany();
  }

  async findOneById(id: string): Promise<StudentSchoolEntity> {
    return this.FixItFridayRepository.findOne({ where: { studentschoolvkey: id } });
  }
}
