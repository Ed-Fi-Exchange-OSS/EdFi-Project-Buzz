import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({ schema: 'fif', name: 'answersbystudent', synchronize: false })
export default class AnswersByStudentEntity {
  @ViewColumn()
  surveykey: string;

  @ViewColumn()
  surveyquestionkey: string;

  @ViewColumn()
  question: string;

  @ViewColumn()
  studentschoolkey: string;

  @ViewColumn()
  answer: string;
}
