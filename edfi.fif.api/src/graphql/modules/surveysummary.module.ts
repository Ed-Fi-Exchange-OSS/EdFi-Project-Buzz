import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import SurveySummaryResolvers from '../resolvers/surveysummary.resolver';
import SurveySummaryService from '../services/surveysummary.service';
import SurveySummaryEntity from '../entities/survey/SurveySummary.entity';
import SurveySummaryQuestionsEntity from '../entities/survey/surveysummaryquestions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SurveySummaryEntity, SurveySummaryQuestionsEntity])],
  providers: [SurveySummaryService, SurveySummaryResolvers],
})
export default class SurveySummaryModule {}
