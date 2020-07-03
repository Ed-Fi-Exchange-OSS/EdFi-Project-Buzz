import { Query, Resolver, ResolveProperty, Parent } from '@nestjs/graphql';
import { SurveySummaryQuestions, SurveySummaryAnswers } from '../graphql.schema';
import SurveySummaryQuestionsService from '../services/surveysummaryquestions.service';

@Resolver('SurveySummaryQuestions')
export default class SurveySummaryQuestionsResolvers {
  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly surveySummaryQuestionsService: SurveySummaryQuestionsService) {}

  @Query()
  async questions(): Promise<SurveySummaryQuestions[]> {
    return this.surveySummaryQuestionsService.findAll();
  }

  @ResolveProperty('answers')
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async answers(@Parent() parent): Promise<SurveySummaryAnswers[]> {
    return this.surveySummaryQuestionsService.findAnswersByQuestion(9, parent.surveyquestionkey);
  }
}
