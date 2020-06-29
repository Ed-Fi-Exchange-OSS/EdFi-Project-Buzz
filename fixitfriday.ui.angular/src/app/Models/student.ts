import { SurveyResult, Guardian } from ".";

export class Student {
  studentId: string;
  name: string;
  email: string;
  gradeLevel: string;
  section: string;
  guardians: Guardian[];
  preferredContactMethod: string;
  contactTime: string;
  contactNotes?: string[];
  siblings?: Sibling[];
  surveys?: SurveyResult[];
  pictureUrl?: string;
  notes?: Note[]
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
