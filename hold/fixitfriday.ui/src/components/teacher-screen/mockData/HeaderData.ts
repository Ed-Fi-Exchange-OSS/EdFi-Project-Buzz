import { TeacherHeaderType } from '../types/TeacherHeaderType';
import { TeacherClassType } from '../types/TeacherClassType';

const sections: Array<TeacherClassType> = [
  {
    sessionname: 'Test',
    localcoursecode: '',
    schoolyear: 2020,
    sectionkey: '1',
  },
  {
    sessionname: 'Test 2',
    localcoursecode: '',
    schoolyear: 2015,
    sectionkey: '2',
  },
];

const TeacherHeaderData: TeacherHeaderType = {
  firstname: 'John',
  lastsurname: 'Doe',
  middlename: '',
  sections,
};

export default TeacherHeaderData;
