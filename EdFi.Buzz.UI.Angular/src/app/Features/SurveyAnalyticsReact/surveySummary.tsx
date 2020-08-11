import * as React from 'react';
import { SurveyQuestionSummary } from 'src/app/Models';

export interface SurveySummaryComponentProps {
  surveyName: string;
  surveyQuestionSummaryList: SurveyQuestionSummary[];
  onSurveyQuestionSelected?: (surveyName: string, surveyQuestion: string) => void;
}

export const SurveySummary: React.FunctionComponent<SurveySummaryComponentProps> = (props: SurveySummaryComponentProps) => {

  function onClickHandle(event, question: SurveyQuestionSummary) {
    event.preventDefault();
    if (props.onSurveyQuestionSelected) {
      props.onSurveyQuestionSelected(props.surveyName, question.question);
    }
  }

  return <div className='col-12 col-md-6'>
    <div id='summaryCard' className='card'>
      <div className='card-body'>
        <h2>Summary: "{props.surveyName}"</h2>

        <ul className='list-group'>
          {props.surveyQuestionSummaryList.map((question, idx) => {
            return <li className='list-group-item' key={`${question.surveyquestionkey}`}>
              <a href='#' onClick={(e) => onClickHandle(e, question)} >{idx + 1}. {question.question}</a><br />
              {question.answers
                .sort((a, b) => (a.count - b.count) * -1 /* inverse order */)
                .map((answer, idxA) => {
                  return <span key={`${question.surveyquestionkey}-${answer.label}`}>
                    {(idxA !== 0 && question.answers.length > 2) && <br />}
                    {(idxA !== 0 && question.answers.length <= 2) && ' | '}
                    {answer.label}:&nbsp;{answer.count} ({
                      Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 1 })
                        .format(answer.count / question.totalAnswers)})
                </span>;
                })}
            </li>;
          })}
        </ul>

      </div>
    </div>
  </div>;
};
