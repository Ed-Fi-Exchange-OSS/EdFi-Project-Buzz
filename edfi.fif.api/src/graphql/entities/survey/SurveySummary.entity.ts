import { ViewEntity, ViewColumn, PrimaryColumn } from 'typeorm';
import SurveySummaryQuestionsEntity from './surveysummaryquestions.entity';

@ViewEntity({ schema: 'fif', name: 'surveysummary', synchronize: false })
export default class SurveySummaryEntity {
  @ViewColumn()
  staffkey: number;

  @ViewColumn()
  sectionkey: string;

  @PrimaryColumn()
  surveykey: number;

  @ViewColumn()
  title: string;

  @ViewColumn()
  studentsanswered: number;

  @ViewColumn()
  numberofquestions: number;

  @ViewColumn()
  totalstudents: number;

  questions?: SurveySummaryQuestionsEntity[];
}
