import { SurveyResult, Guardian, ContactPerson } from '.';

export class Student {

  studentkey?: string;
  studentschoolkey?: string;
  schoolkey?: string;

  schoolname?: String;
  schoolyear?: string;

  name?: string;
  studentfirstname?: string;
  studentmiddlename?: string;
  studentlastname?: string;
  primaryemailaddress?: string;

  enrollmentdatekey?: string;
  gradelevel?: string;
  limitedenglishproficiency?: string;
  ishispanic?: boolean;
  sex?: string;
  pictureurl?: string;
  contacts?: ContactPerson[];
  siblingscount?: number;
  siblings?: Student[];


  // to Depreicate: These will be removed soon
  section?: string;
  surveys?: any[];
  notes?: any[];
  guardians?: any[];

  constructor() {
    this.contacts = [];
    this.siblings = [];
    this.surveys = [];
    this.notes = [];
    this.guardians = [];
  }
}

export class Sibling {
  name: string;
  gradeLevel: string;
  schoolName: string;
}

export class Note {
  id: number;
  note: string;
  date: Date;
  teacher: string;
}
