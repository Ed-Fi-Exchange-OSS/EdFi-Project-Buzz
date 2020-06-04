import { StudentDetailGuardianType } from './StudentDetailGuardianType';

export type SurveyQuestionType = {
  id: string;
  question: string;
  answer: string;
};

export type StudentDetailSurveyType = {
  id: string;
  name: string;
  questions: Array<SurveyQuestionType>;
};

export type StudentDetailType = {
  id: string;
  firstName: string;
  lastName: string;
  middleName: string;
  pictureurl: string;
  email: string;
  guardians: Array<StudentDetailGuardianType>;
  surveys?: Array<StudentDetailSurveyType>;
};
