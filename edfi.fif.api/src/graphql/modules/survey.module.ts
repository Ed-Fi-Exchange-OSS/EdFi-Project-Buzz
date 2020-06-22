import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import SurveyResolvers from '../resolvers/survey.resolver';
import SurveyService from '../services/survey.service';
import SurveyEntity from '../entities/survey.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SurveyEntity])],
  providers: [SurveyService, SurveyResolvers],
})
export default class SurveyModule {}
