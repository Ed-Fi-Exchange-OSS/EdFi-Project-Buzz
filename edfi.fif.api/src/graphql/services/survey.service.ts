import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import SurveyEntity from '../entities/survey.entity';

@Injectable()
export default class SurveyService {
  // eslint-disable-next-line no-useless-constructor
  constructor(@InjectRepository(SurveyEntity) private readonly FixItFridayRepository: Repository<SurveyEntity>) {}

  async findAll(): Promise<SurveyEntity[]> {
    return this.FixItFridayRepository.find();
  }

  async findOneById(id: string): Promise<SurveyEntity> {
    return this.FixItFridayRepository.findOne({ where: { surveykey: id } });
  }
}
