import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import SurveySummaryQuestionsEntity from '../entities/survey/surveysummaryquestions.entity';
import SurveySummaryAnswersEntity from '../entities/survey/surveysummaryanswers.entity';

@Injectable()
export default class SurveySummaryQuestionsService {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    @InjectRepository(SurveySummaryQuestionsEntity)
    private readonly FixItFridayRepository: Repository<SurveySummaryQuestionsEntity>,
    @InjectRepository(SurveySummaryAnswersEntity)
    private readonly FixItFridayAnswersRepository: Repository<SurveySummaryAnswersEntity>,
  ) {}

  async findAll(): Promise<SurveySummaryQuestionsEntity[]> {
    return this.FixItFridayRepository.find();
  }

  async findAnswersByQuestion(sectionkey: number, surveyquestionkey: number): Promise<SurveySummaryAnswersEntity[]> {
    return this.FixItFridayAnswersRepository.createQueryBuilder('SurveySummaryAnswers')
      .leftJoin(SurveySummaryQuestionsEntity, 'ss', `SurveySummaryAnswers.surveyquestionkey = ss.surveyquestionkey`)
      .where({ surveyquestionkey })
      .getMany();
  }
}
