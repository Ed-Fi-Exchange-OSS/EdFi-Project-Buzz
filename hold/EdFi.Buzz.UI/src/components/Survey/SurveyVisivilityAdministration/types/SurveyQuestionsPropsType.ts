import { SurveyQuestionType } from '../../types/SurveyQuestionType';

export type SurveyQuestionsPropsType = {
  survey: Array<SurveyQuestionType>;
  surveyDisabled?: boolean;

  onHide?(): void;
};
