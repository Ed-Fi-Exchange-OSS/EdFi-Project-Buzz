import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import SectionEntity from '../entities/section.entity';

@Injectable()
export default class SectionService {
  // eslint-disable-next-line no-useless-constructor
  constructor(@InjectRepository(SectionEntity) private readonly FixItFridayRepository: Repository<SectionEntity>) {}

  async findAll(): Promise<SectionEntity[]> {
    return this.FixItFridayRepository.find();
  }

  async findOneById(id: string): Promise<SectionEntity> {
    return this.FixItFridayRepository.findOne({ where: { sectionkey: id } });
  }
}
