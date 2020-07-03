import { ViewEntity, ViewColumn, PrimaryColumn } from 'typeorm';

@ViewEntity({ schema: 'fif', name: 'surveysummaryanswers', synchronize: false })
export default class SurveySummaryAnswersEntity {
  @ViewColumn()
  sectionkey: number;

  @PrimaryColumn()
  surveykey: number;

  @ViewColumn()
  title: string;

  @ViewColumn()
  surveyquestionkey: number;

  @ViewColumn()
  question: string;

  @ViewColumn()
  studentschoolkey: number;

  @ViewColumn()
  studentname: string;

  @ViewColumn()
  answer: string;
}
