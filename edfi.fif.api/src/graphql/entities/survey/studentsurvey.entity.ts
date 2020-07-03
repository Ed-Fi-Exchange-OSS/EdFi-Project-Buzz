import { Entity, Column, PrimaryColumn } from 'typeorm';
import SurveyEntity from './survey.entity';
import AnswersByStudentEntity from './answersbystudent.entity';

@Entity({ schema: 'fif', name: 'studentsurvey', synchronize: false })
export default class StudentSurveyEntity {
  @PrimaryColumn({ type: 'varchar', nullable: false })
  studentsurveykey: string;

  @Column({ type: 'varchar', nullable: false })
  surveykey: string;

  @Column({ type: 'varchar', nullable: false })
  studentschoolkey: string;

  @Column({ type: 'varchar', nullable: false })
  date: string;

  survey: SurveyEntity;

  answers: AnswersByStudentEntity[];
}
