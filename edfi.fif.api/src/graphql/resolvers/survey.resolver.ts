import { Args, Query, Resolver } from '@nestjs/graphql';
import { Survey } from '../graphql.schema';
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
}
