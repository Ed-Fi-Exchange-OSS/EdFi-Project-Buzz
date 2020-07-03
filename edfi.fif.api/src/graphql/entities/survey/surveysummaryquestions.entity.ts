import { ViewEntity, ViewColumn, PrimaryColumn } from 'typeorm';
import SurveySummaryAnswers from './surveysummaryanswers.entity';

@ViewEntity({ schema: 'fif', name: 'surveysummaryquestions', synchronize: false })
export default class SurveySummaryQuestionsEntity {
  @ViewColumn()
  surveykey: number;

  @ViewColumn()
  title: string;

  @PrimaryColumn()
  surveyquestionkey: number;

  @ViewColumn()
  question: string;

  answers?: SurveySummaryAnswers[];
}
