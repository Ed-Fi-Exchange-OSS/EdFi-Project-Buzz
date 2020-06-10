import { SurveyDefinitionType } from './SurveyDefinitionType';
import { SectionSurveyType } from './SectionSurveyType';

export type SectionSurveyRostType = {
  surveydefinition: Array<SurveyDefinitionType>;
  surveyresults?: Array<SectionSurveyType>;
};
