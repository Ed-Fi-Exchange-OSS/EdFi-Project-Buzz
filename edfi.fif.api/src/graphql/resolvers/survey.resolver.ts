import { Args, Query, Resolver, ResolveProperty, Parent } from '@nestjs/graphql';
import { Survey, SurveyQuestion } from '../graphql.schema';
import SurveyService from '../services/survey.service';

@Resolver('Survey')
export default class SurveyResolvers {
  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly surveysService: SurveyService) {}

  @Query()
  async surveys(): Promise<Survey[]> {
    return this.surveysService.findAll();
  }

  @Query('survey')
  async findOneById(
    @Args('surveykey')
    surveykey: string,
  ): Promise<Survey> {
    return this.surveysService.findOneById(surveykey);
  }

  @ResolveProperty('questions')
  async findQuestionBySurveyKey(@Parent() parent: Survey): Promise<SurveyQuestion[]> {
    return this.surveysService.findQuestionBySurveyKey(parent.surveykey);
  }
}
