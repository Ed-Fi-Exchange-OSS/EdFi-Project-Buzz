import { StudentDetailSurveyType } from '../../Student/types/StudentDetailTypes';

export type SectionSurveyType = {
  surveykey: string;
  sectionkey?: string;
  answers: Array<StudentDetailSurveyType>;
};
