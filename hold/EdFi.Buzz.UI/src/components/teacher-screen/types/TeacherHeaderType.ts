import { TeacherClassType } from './TeacherClassType';

export type TeacherHeaderType = {
  sections: Array<TeacherClassType>;
  firstname: string;
  middlename: string;
  lastsurname: string;
};
