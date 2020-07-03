import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import SurveySummaryQuestionsResolvers from '../resolvers/surveysummaryquestions.resolver';
import SurveySummaryQuestionsService from '../services/surveysummaryquestions.service';
import SurveySummaryQuestionsEntity from '../entities/survey/surveysummaryquestions.entity';
import SurveySummaryAnswersEntity from '../entities/survey/surveysummaryanswers.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SurveySummaryQuestionsEntity, SurveySummaryAnswersEntity])],
  providers: [SurveySummaryQuestionsService, SurveySummaryQuestionsResolvers],
})
export default class SurveySummaryQuestionsModule {}
