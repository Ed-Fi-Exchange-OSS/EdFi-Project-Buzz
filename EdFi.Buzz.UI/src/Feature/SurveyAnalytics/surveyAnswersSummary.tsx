import * as React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FunctionComponent, useEffect, useState } from 'react';
import ApiService from 'Services/ApiService';
import { ColumnOption, DataTable } from 'Components/DataTable/dataTable';
import AllStudentAnswers from 'Models/AllStudentAnswers';
import { StyledCard } from 'buzztheme';
import { ChartAndTable } from './surveyChartAndTable';
import { SurveyMetadata, SurveyQuestionSummary } from '../../Models';

export interface SurveyAnswersSummaryProps {
  api: ApiService;
  selectedSurveyMetadata: SurveyMetadata;
}

const SurveyTitle = styled.div`
  font-size: 14px;
  color: var(--slate-gray);
  font: ${(props) => props.theme.fonts.bold};

  .questionIndex {
    color: var(--picton-blue);
  }
`;

const SurveyStyledCard = styled(StyledCard)`
  & {
    padding: 1rem 1rem 1rem 1rem;
  }

  & .h2-desktop {
    padding-bottom: 1em;
  }
`;

const SurveyAnswersSummary: FunctionComponent<SurveyAnswersSummaryProps> = ({ api, selectedSurveyMetadata }) => {
  const [surveyMetadataList] = useState(selectedSurveyMetadata);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(null as number);
  const [selectedAnswer, setSelectedAnswer] = useState(null as string);
  const [selectedSurveyQuestionSummaryList, setSelectedSurveyQuestionSummaryList] = useState(
    null as SurveyQuestionSummary[]
  );
  const [selectedSurveyAnswers, setSelectedSurveyAnswers] = useState(null as AllStudentAnswers[]);
  const [noData] = useState(false);
  useEffect(() => {
    if(surveyMetadataList){
      api.surveyAnalytics
        .getSurveyQuestionSummaryList(surveyMetadataList.surveykey, surveyMetadataList.sectionkey)
        .then((response) => {
          setSelectedSurveyQuestionSummaryList(response);
        });

      api.surveyAnalytics
        .getAllSurveyAnswers(surveyMetadataList.surveykey, surveyMetadataList.sectionkey)
        .then((response) => setSelectedSurveyAnswers(response));
    }
  }, [surveyMetadataList]);// eslint-disable-line react-hooks/exhaustive-deps

  function onSurveyAnswerSelected(answer: string, questionIndex: number) {
    setSelectedAnswer(answer);
    setSelectedQuestionIndex(questionIndex);
  }

  function getSurveyAnswersLabels(
    SurveyAnswersSummaryList: SurveyQuestionSummary[],
    questionFilter?: string
  ): ColumnOption[] {
    return [
      { label: 'studentschoolkey', hide: true } as ColumnOption,
      { label: 'Student', linkColumnIndex: 0 } as ColumnOption
    ].concat(
      SurveyAnswersSummaryList
        .filter((question) => !questionFilter || question.question === questionFilter)
        .map((question, index) => ({ label: `${questionFilter ? '' : `${index + 1}.`} ${question.question}` }))
    );
  }
  function getSurveyAnswersDataset(
    surveyAnswersList: AllStudentAnswers[],
    SurveyAnswersSummaryList: SurveyQuestionSummary[],
    questionFilter?: string
  ): string[][] {
    if (!surveyAnswersList) {
      return [];
    }

    return surveyAnswersList.map((student) =>
      [student.studentschoolkey, student.studentname].concat(
        SurveyAnswersSummaryList
          .filter((question) => !questionFilter || question.question === questionFilter)
          .map((question) => student.answers[question.surveyquestionkey])
      )
    );
  }
  return (
    <>

      {!selectedSurveyQuestionSummaryList && !noData && selectedSurveyMetadata.numberofquestions > 0 && (
        <><div className='col-12'>
          <div className='alert alert-info'>Loading...</div>
        </div></>)
      }
      { noData && (
        <div className='col-12'>
          <div className='alert alert-warning'>No survey found.</div>
        </div>
      )
      }
      {selectedSurveyQuestionSummaryList && !noData && (
        <>
          <div className='survey-questions-label h2-desktop'>QUESTIONS</div>
          <div className='row'>
            {selectedSurveyQuestionSummaryList.map((question, index) => (
              <div className='col-12 col-md-6' key={question.surveyquestionkey}>
                <div id='chartCard'>
                  <div className='card-body'>
                    <ChartAndTable
                      columns={getSurveyAnswersLabels(selectedSurveyQuestionSummaryList, question.question)}
                      dataSet={getSurveyAnswersDataset(
                        selectedSurveyAnswers,
                        selectedSurveyQuestionSummaryList,
                        question.question
                      )}
                      question={question}
                      title={
                        <SurveyTitle>
                          <span className={'questionIndex'}>{index + 1}) </span>
                          {question.question}
                        </SurveyTitle>
                      }
                      index={index}
                      afterSelectionChangedHandler={(answer: string) => onSurveyAnswerSelected(answer, index)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {selectedSurveyQuestionSummaryList && selectedSurveyAnswers && (
        <SurveyStyledCard>
          <div className='h2-desktop'>Survey Details by Student</div>
          <div className='table-responsive-md'>
            <DataTable
              columns={getSurveyAnswersLabels(selectedSurveyQuestionSummaryList)}
              dataSet={getSurveyAnswersDataset(selectedSurveyAnswers, selectedSurveyQuestionSummaryList)}
              linkBaseURL={'studentDetail/'}
              defaultSort={1}
              highlightFilterByColumn={
                selectedAnswer
                  ? {
                    columnIndex: selectedQuestionIndex + 2 /* account for added columns */,
                    filter: selectedAnswer
                  }
                  : null
              }
              key={selectedSurveyMetadata.surveykey}
            />
          </div>
        </SurveyStyledCard>
      )}
    </>

  );
};
SurveyAnswersSummary.propTypes = {
  api: PropTypes.any,
  selectedSurveyMetadata: PropTypes.any
};
export default SurveyAnswersSummary;
