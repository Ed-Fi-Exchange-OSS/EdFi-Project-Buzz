import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import StaffSectionAssociationEntity from '../entities/staffsectionassociation.entity';

@Injectable()
export default class StaffSectionAssociationService {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    @InjectRepository(StaffSectionAssociationEntity)
    private readonly FixItFridayRepository: Repository<StaffSectionAssociationEntity>,
  ) {}

  async findAll(): Promise<StaffSectionAssociationEntity[]> {
    return this.FixItFridayRepository.find();
  }

  async findOneById(id: string): Promise<StaffSectionAssociationEntity> {
    return this.FixItFridayRepository.findOne({ where: { staffkey: id } });
  }
}
