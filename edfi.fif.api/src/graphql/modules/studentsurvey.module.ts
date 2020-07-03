import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import StudentSurveyResolvers from '../resolvers/studentsurvey.resolver';
import StudentSurveyService from '../services/studentsurvey.service';
import SurveyEntity from '../entities/survey/survey.entity';
import AnswersByStudentEntity from '../entities/survey/answersbystudent.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SurveyEntity, AnswersByStudentEntity])],
  providers: [StudentSurveyService, StudentSurveyResolvers],
})
export default class StudentSurveyModule {}
