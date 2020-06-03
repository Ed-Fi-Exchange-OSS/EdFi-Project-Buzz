import { StudentDetailGuardianType } from "./StudentDetailGuardianType";

export type StudentDetailType = {
  id: string;
  firstName: string;
  lastName: string;
  middleName: string;
  pictureurl: string;
  email: string;
  guardians: Array<StudentDetailGuardianType>;
};
