import { Entity, Column, PrimaryColumn } from 'typeorm';
import { SurveyJson } from './Survey/SurveyJson';

@Entity({ schema: 'fif', name: 'survey', synchronize: false })
export default class SurveyEntity {
  @PrimaryColumn({ type: 'varchar', nullable: false })
  surveykey: string;

  @Column({ type: 'varchar', nullable: false })
  title: string;

  @Column({ type: 'json', nullable: false })
  info: [SurveyJson];
}
