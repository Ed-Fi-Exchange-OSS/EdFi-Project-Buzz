import { Entity, Column, PrimaryColumn } from 'typeorm';
import StudentSurveyEntity from './survey/studentsurvey.entity';
import StudentNoteEntity from './studentnote.entity';

@Entity({ schema: 'fif', name: 'studentschool', synchronize: false })
export default class StudentSchoolEntity {
  @PrimaryColumn() studentschoolkey: string;

  @Column() studentkey: string;

  @Column() schoolkey: string;

  @Column() schoolyear: string;

  @Column() studentfirstname: string;

  @Column() studentmiddlename: string;

  @Column() studentlastname: string;

  @Column() enrollmentdatekey: string;

  @Column() gradelevel: string;

  @Column() limitedenglishproficiency: string;

  @Column() ishispanic: boolean;

  @Column() sex: string;

  @Column() pictureurl: string;

  studentsurveys?: StudentSurveyEntity[];

  notes?: StudentNoteEntity[];
}
