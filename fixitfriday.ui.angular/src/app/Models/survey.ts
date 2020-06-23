export class SurveyResult {
  id: number;
  name: string;
  dateAnswered: Date;
  items: SurveyItem[];
}

export class SurveyItem {
  question: string;
  answer: string;
}
