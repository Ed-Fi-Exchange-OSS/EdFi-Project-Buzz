import { ResolveProperty, Resolver, Parent } from '@nestjs/graphql';
import { StudentSurvey, AnswersByStudent } from '../graphql.schema';
import StudentSurveyService from '../services/studentsurvey.service';

@Resolver('StudentSurvey')
export default class StudentSurveyResolvers {
  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly studentSurveyService: StudentSurveyService) {}

  @ResolveProperty('survey')
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async studentsurveys(@Parent() parent): Promise<StudentSurvey> {
    return this.studentSurveyService.findSurvey(parent.surveykey);
  }

  @ResolveProperty('answers')
  async findAnwsersByStudent(@Parent() parent: StudentSurvey): Promise<AnswersByStudent[]> {
    return this.studentSurveyService.findAnwsersByStudent(parent.surveykey, parent.studentschoolkey);
  }
}
