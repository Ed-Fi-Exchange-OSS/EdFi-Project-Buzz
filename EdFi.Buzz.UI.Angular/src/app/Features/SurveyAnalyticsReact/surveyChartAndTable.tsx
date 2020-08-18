import * as React from 'react';
import { SurveyChart } from './surveyChart';
import { SurveyQuestionSummary } from 'src/app/Models';
import { DataTable } from 'src/app/Components/DataTable/dataTable';

export interface ChartAndTableComponentProps {
  question: SurveyQuestionSummary;
  columns: any[];
  dataSet: any[];
  title?: string | React.ReactElement;
  afterSelectionChangedHandler?: (newSelection: string) => void;
}

export const ChartAndTable: React.FunctionComponent<ChartAndTableComponentProps> = (props: ChartAndTableComponentProps) => {
  const selectedQuestion = props.question;

  const [viewAnswersByStudent, setViewAnswersByStudent] = React.useState(false);
  const [selectedAnswer, setSelectedAnswer] = React.useState(null as string);

  function onAnswerSelectionChangedHandler(answer: string) {
    setSelectedAnswer(answer);
    if (props.afterSelectionChangedHandler) {
      props.afterSelectionChangedHandler(answer);
    }
  }

  return <>
    <SurveyChart title={props.title}
      question={selectedQuestion}
      afterSelectionChangedHandler={onAnswerSelectionChangedHandler} />

    <div onClick={() => setViewAnswersByStudent(!viewAnswersByStudent)} className={'view-answers-by-student'}>
      View answers by student <span className={viewAnswersByStudent ? 'ion-md-arrow-dropup-circle' : 'ion-md-arrow-dropdown-circle'}></span>
    </div>

    {(viewAnswersByStudent && selectedQuestion) && <DataTable
      columns={props.columns}
      dataSet={props.dataSet}
      linkBaseURL={'/#/app/studentDetail/'}
      defaultSort={1}
      alwaysSortLastByColumn={1}
      filterByColumn={selectedAnswer ? { columnIndex: 2, filter: selectedAnswer } : null}
      key={selectedQuestion.question}
    />
    }

  </>;
};
