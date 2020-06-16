import { SurveyQuestionType } from './SurveyQuestionType';

export type SurveyDefinitionType = {
  surveykey: string;
  surveyname: string;
  questions: Array<SurveyQuestionType>;
  disabled?: boolean;
};
