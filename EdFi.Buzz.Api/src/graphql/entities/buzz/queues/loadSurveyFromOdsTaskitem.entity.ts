import { OdsSurvey } from 'src/graphql/graphql.schema';

export default class LoadSurveyFromOdsTaskItem {
  staffkey?: string;

  surveyList?: OdsSurvey[];

  jobkey?: string;

  updatesurvey?: boolean;
}
