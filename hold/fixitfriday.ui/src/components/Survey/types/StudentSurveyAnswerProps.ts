import { SurveyDefinitionType } from './SurveyDefinitionType';
import { SurveyQuestionType } from './SurveyQuestionType';

export type StudentSurveyAnswerProps = {
  surveyDefinition: SurveyDefinitionType;
  studentId: string;
  studentName: string;
  studentanswer: SurveyQuestionType;
};
