import { StudentDetailGuardianType } from './StudentDetailGuardianType';
import { StudentDetailSiblingType } from './StudentDetailSiblingType';
import { SurveyQuestionType } from '../../Survey/types/SurveyQuestionType';

export type StudentDetailSurveyType = {
  id: string;
  name: string;
  date: string;
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
  siblings?: Array<StudentDetailSiblingType>;
};
