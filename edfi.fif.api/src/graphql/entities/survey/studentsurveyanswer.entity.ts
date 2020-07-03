import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ schema: 'fif', name: 'studentsurveyanswer', synchronize: false })
export default class StudentSurveyAnswerEntity {
  @PrimaryColumn({ type: 'varchar', nullable: false })
  studentsurveyanswerkey: string;

  @Column({ type: 'varchar', nullable: false })
  studentsurveykey: string;

  @Column({ type: 'varchar', nullable: false })
  surveyquestion: string;

  @Column({ type: 'varchar', nullable: false })
  answer: string;
}
