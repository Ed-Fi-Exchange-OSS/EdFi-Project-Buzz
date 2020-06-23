import { SurveyDefinitionType } from './SurveyDefinitionType';
import { SectionSurveyType } from './SectionSurveyType';

export type SurveyResultsType = {
  surveydefinition: SurveyDefinitionType;
  answers: Array<SectionSurveyType>;
};
