import { SurveyQuestionType } from '../../Survey/types/SurveyQuestionType';

export type PieChartProps = {
  questionId: string;
  question: string;
  answers: Array<SurveyQuestionType>;
  radius?: number;
  width?: number;
  height?: number;
  posX?: number;
  posY?: number;
};

export type PieChartDataItem = {
  name: string;
  value: number;
};
