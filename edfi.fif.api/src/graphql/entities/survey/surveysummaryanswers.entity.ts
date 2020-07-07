import { ViewEntity, ViewColumn, PrimaryColumn } from 'typeorm';

@ViewEntity({ schema: 'fif', name: 'surveysummaryanswers', synchronize: false })
export default class SurveySummaryAnswersEntity {
  @ViewColumn()
  sectionkey: string;

  @PrimaryColumn()
  surveykey: number;

  @ViewColumn()
  title: string;

  @ViewColumn()
  surveyquestionkey: number;

  @ViewColumn()
  question: string;

  @ViewColumn()
  studentschoolkey: string;

  @ViewColumn()
  studentname: string;

  @ViewColumn()
  answer: string;
}
