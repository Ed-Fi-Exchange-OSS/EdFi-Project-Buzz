import { StudentDetailGuardianType } from "./StudentDetailGuardianType";

export type StudentDetailProps = {
  id: string;
  firstName: string;
  lastName: string;
  middleName: string;
  pictureurl: string;
  email: string;
  guardians: Array<StudentDetailGuardianType>;
};
