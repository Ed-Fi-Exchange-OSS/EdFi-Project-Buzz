import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import SectionEntity from '../entities/section.entity';
import StaffEntity from '../entities/staff.entity';
import StaffSectionAssociationEntity from '../entities/staffsectionassociation.entity';

@Injectable()
export default class StaffService {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    @InjectRepository(StaffEntity) private readonly FixItFridayRepository: Repository<StaffEntity>,
    @InjectRepository(SectionEntity) private readonly FixItFridaySectionRepository: Repository<SectionEntity>,
  ) {}

  async findAll(): Promise<StaffEntity[]> {
    return this.FixItFridayRepository.find();
  }

  async findOneById(id: number): Promise<StaffEntity> {
    return this.FixItFridayRepository.findOne({ where: { staffkey: id } });
  }

  async findSectionByStaff(staffkey: number): Promise<SectionEntity[]> {
    return this.FixItFridaySectionRepository.createQueryBuilder('section')
      .leftJoin(StaffSectionAssociationEntity, 'ssa', `section.sectionkey = ssa.sectionkey and ssa.staffkey='${staffkey}'`)
      .getMany();
  }
}
