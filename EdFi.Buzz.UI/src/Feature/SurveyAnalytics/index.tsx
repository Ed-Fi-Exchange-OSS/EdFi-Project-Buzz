import * as React from 'react';
import { FunctionComponent, useState } from 'react';
import styled from 'styled-components';

import { Section } from 'Models';
import { ColumnOption, DataTable } from 'Components/DataTable/dataTable';
import SurveyMetadata from 'Models/SurveyMetadata';
import SurveyQuestionSummary from 'Models/SurveyQuestionSummary';
import AllStudentAnswers from 'Models/AllStudentAnswers';
import ApiService from '../../Services/ApiService';
import { SearchInSections } from '../../Components/SearchInSections/searchInSections';

import { SurveyMetadataUI } from './surveyMetadataUI';
import { ChartAndTable } from './surveyChartAndTable';
import { HeadlineContainer, MainContainer, TitleSpanContainer, TotalRecordsContainer, StyledCard } from '../../buzztheme';

export interface SurveyAnalyticsComponentProps {
  api: ApiService;
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

export const SurveyAnalytics: FunctionComponent<SurveyAnalyticsComponentProps> = (props: SurveyAnalyticsComponentProps) => {
  const {teacher} = props.api.authentication.currentUserValue;
  const [sectionList] = useState(teacher.sections as Section[]);
  const [surveyMetadataList, setSurveyMetadataList] = useState([] as SurveyMetadata[]);
  const [selectedSectionKey, setSelectedSectionKey] = useState(null as string);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedSurveyMetadata, setSelectedSurveyMetadata] = useState(null as SurveyMetadata);
  const [selectedSurveyQuestionSummaryList, setSelectedSurveyQuestionSummaryList] = useState(
    null as SurveyQuestionSummary[]
  );
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(null as number);
  const [selectedAnswer, setSelectedAnswer] = useState(null as string);
  const [selectedSurveyAnswers, setSelectedSurveyAnswers] = useState(null as AllStudentAnswers[]);

  function resetSelectedSurvey() {
    setSelectedSurveyMetadata(null);
    setSelectedSurveyQuestionSummaryList(null);
    setSelectedSurveyAnswers(null);
  }

  function onSearchHandle(sectionKey: string, studentFilter: string) {
    resetSelectedSurvey();
    props.api.surveyAnalytics.getSurveyMetadata(sectionKey, studentFilter).then((result) => {
      setSurveyMetadataList(result);
      setSelectedSectionKey(sectionKey);
      setShowSearchResults(true);
    });
  }

  function onSurveySelectedHandler(surveyMetadata: SurveyMetadata) {
    resetSelectedSurvey();
    setSelectedSurveyMetadata(surveyMetadata);

    props.api.surveyAnalytics
      .getSurveyQuestionSummaryList(surveyMetadata.surveykey, surveyMetadata.sectionkey)
      .then((response) => {
        setSelectedSurveyQuestionSummaryList(response);
      });

    props.api.surveyAnalytics
      .getAllSurveyAnswers(surveyMetadata.surveykey, surveyMetadata.sectionkey)
      .then((response) => setSelectedSurveyAnswers(response));
  }

  function onSurveyAnswerSelected(answer: string, questionIndex: number) {
    setSelectedAnswer(answer);
    setSelectedQuestionIndex(questionIndex);
  }

  function getSurveyAnswersLabels(
    surveyQuestionSummaryList: SurveyQuestionSummary[],
    questionFilter?: string
  ): ColumnOption[] {
    return [
      { label: 'studentschoolkey', hide: true } as ColumnOption,
      { label: 'Student', linkColumnIndex: 0 } as ColumnOption
    ].concat(
      surveyQuestionSummaryList
        .filter((question) => !questionFilter || question.question === questionFilter)
        .map((question, index) => ({ label: `${questionFilter ? '' : `${index + 1}.`} ${question.question}` }))
    );
  }
  function getSurveyAnswersDataset(
    surveyAnswersList: AllStudentAnswers[],
    surveyQuestionSummaryList: SurveyQuestionSummary[],
    questionFilter?: string
  ): string[][] {
    if (!surveyAnswersList) {
      return [];
    }

    return surveyAnswersList.map((student) =>
      [student.studentschoolkey, student.studentname].concat(
        surveyQuestionSummaryList
          .filter((question) => !questionFilter || question.question === questionFilter)
          .map((question) => student.answers[question.surveyquestionkey])
      )
    );
  }

  return (
    <MainContainer role='main' className='container'>
      <HeadlineContainer>
        <TitleSpanContainer>Surveys</TitleSpanContainer>
        <TotalRecordsContainer>Total {surveyMetadataList.length}</TotalRecordsContainer>
      </HeadlineContainer>
      <SearchInSections
        sectionList={sectionList}
        onSearch={onSearchHandle}
        defaultValue={selectedSectionKey}
        searchFilterPlaceholder={'Filter survey titles'}
      />

      {showSearchResults && (
        <div className='row'>
          <SurveyMetadataUI
            surveyMetadataList={surveyMetadataList}
            selectedSurveyKey={selectedSurveyMetadata ? selectedSurveyMetadata.surveykey : null}
            onSurveySelected={onSurveySelectedHandler}
          />
        </div>
      )}

      {selectedSurveyQuestionSummaryList && (
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
              linkBaseURL={'/#/app/studentDetail/'}
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
    </MainContainer>
  );
};

export default SurveyAnalytics;
