import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import SurveySummaryEntity from '../entities/survey/SurveySummary.entity';
import SurveySummaryQuestionsEntity from '../entities/survey/surveysummaryquestions.entity';

@Injectable()
export default class SurveySummaryService {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    @InjectRepository(SurveySummaryEntity) private readonly FixItFridayRepository: Repository<SurveySummaryEntity>,
    @InjectRepository(SurveySummaryQuestionsEntity)
    private readonly FixItFridayQuestionsRepository: Repository<SurveySummaryQuestionsEntity>,
  ) {}

  async findAll(title: string, sectionkey: string): Promise<SurveySummaryEntity[]> {
    if (title) {
      return this.FixItFridayRepository.createQueryBuilder('SurveySummary')
        .where(`SurveySummary.sectionkey = '${sectionkey}' AND LOWER(SurveySummary.title) like LOWER('%${title}%')`)
        .getMany();
    }
    return this.FixItFridayRepository.find({ where: { sectionkey } });
  }

  async findQuestionsBySurvey(surveykey: number): Promise<SurveySummaryQuestionsEntity[]> {
    return this.FixItFridayQuestionsRepository.createQueryBuilder('SurveySummaryQuestions')
      .leftJoin(SurveySummaryEntity, 'ss', `SurveySummaryQuestions.surveykey = ss.surveykey and ss.surveykey='${surveykey}'`)
      .where({ surveykey })
      .getMany();
  }
}
