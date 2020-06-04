import { GuardianInformationType } from './StudentClassType';

export type StudentCardProps = {
  studentSchoolKey: string;
  studentFirstName: string;
  studentLastName: string;
  email: string;
  pictureurl: string;
  guardianInformation: GuardianInformationType;
};
