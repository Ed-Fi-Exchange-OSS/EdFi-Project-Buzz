import { Entity, Column, PrimaryColumn } from 'typeorm';
import SurveyQuestionEntity from './surveyquestion.entity';

@Entity({ schema: 'fif', name: 'survey', synchronize: false })
export default class SurveyEntity {
  @PrimaryColumn({ type: 'varchar', nullable: false })
  surveykey: string;

  @Column({ type: 'varchar', nullable: false })
  title: string;

  questions?: SurveyQuestionEntity[];
}
