import { Resolver, ResolveProperty, Parent } from '@nestjs/graphql';
import { SurveySummaryAnswers } from '../graphql.schema';
import SurveySummaryQuestionsService from '../services/surveysummaryquestions.service';

@Resolver('SurveySummaryQuestions')
export default class SurveySummaryQuestionsResolvers {
  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly surveySummaryQuestionsService: SurveySummaryQuestionsService) {}

  @ResolveProperty('answers')
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async answers(@Parent() parent): Promise<SurveySummaryAnswers[]> {
    return this.surveySummaryQuestionsService.findAnswersByQuestion(9, parent.surveyquestionkey);
  }
}
