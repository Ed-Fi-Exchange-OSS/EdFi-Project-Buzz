import { Args, Query, Resolver, ResolveProperty, Parent } from '@nestjs/graphql';
import { SurveySummary, SurveySummaryQuestions } from '../graphql.schema';
import SurveySummaryService from '../services/surveysummary.service';

@Resolver('SurveySummary')
export default class SurveySummaryResolvers {
  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly surveySummaryService: SurveySummaryService) {}

  @Query()
  async surveysummary(
    @Args('title', { nullable: false }) title: string,
    @Args('sectionkey', { nullable: true }) sectionkey: string,
  ): Promise<SurveySummary[]> {
    return this.surveySummaryService.findAll(title, sectionkey);
  }

  @ResolveProperty('questions')
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async questions(@Parent() parent): Promise<SurveySummaryQuestions[]> {
    return this.surveySummaryService.findQuestionsBySurvey(parent.surveykey);
  }
}
