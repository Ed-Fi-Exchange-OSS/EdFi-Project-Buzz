import * as React from 'react';
import { FunctionComponent, useState } from 'react';

import { ApiService } from 'src/app/Services/api.service';
import { SearchInSections } from 'src/app/Components/SearchInSectionsUIReact/searchInSections';
import { Section, SurveyMetadata, SurveyQuestionSummary } from 'src/app/Models';

import { SurveyMetadataUI } from './surveyMetadataUI';
import { SurveySummary } from './surveySummary';
import { DataTable, ColumnOption } from 'src/app/Components/DataTable/dataTable';
import { AllStudentAnswers } from 'src/app/Models/survey';
import { ChartAndTable } from './surveyChartAndTable';

export interface SurveyAnalyticsComponentProps {
  api: ApiService;
}

export const SurveyAnalytics: FunctionComponent<SurveyAnalyticsComponentProps> = (props: SurveyAnalyticsComponentProps) => {

  const teacher = props.api.authentication.currentUserValue.teacher;
  const [sectionList, setSections] = useState(teacher.sections as Section[]);
  const [surveyMetadataList, setSurveyMetadataList] = useState([] as SurveyMetadata[]);
  const [selectedSectionKey, setSelectedSectionKey] = useState(null as string);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedSurveyMetadata, setSelectedSurveyMetadata] = useState(null as SurveyMetadata);
  const [selectedSurveyQuestionSummaryList, setSelectedSurveyQuestionSummaryList] = useState(null as SurveyQuestionSummary[]);
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
    props.api.surveyAnalytics
      .getSurveyMetadata(sectionKey, studentFilter)
      .then(result => {
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
      .then(response => {
        setSelectedSurveyQuestionSummaryList(response);
      });

    props.api.surveyAnalytics
      .getAllSurveyAnswers(surveyMetadata.surveykey, surveyMetadata.sectionkey)
      .then(response => setSelectedSurveyAnswers(response));
  }

  function onSurveyAnswerSelected(answer: string, questionIndex: number) {
    setSelectedAnswer(answer);
    setSelectedQuestionIndex(questionIndex);
  }

  function getSurveyAnswersLabels(surveyQuestionSummaryList: SurveyQuestionSummary[], questionFilter?: string): ColumnOption[] {
    return [{ label: 'studentschoolkey', hide: true } as ColumnOption, { label: 'Student', linkColumnIndex: 0 } as ColumnOption]
      .concat(surveyQuestionSummaryList
        .filter(question => !questionFilter || question.question === questionFilter)
        .map((question, index) => {
          return { label: `${questionFilter ? '' : `${index + 1}.`} ${question.question}` };
        })
      );
  }
  function getSurveyAnswersDataset(
    surveyAnswersList: AllStudentAnswers[],
    surveyQuestionSummaryList: SurveyQuestionSummary[],
    questionFilter?: string
  ): any[][] {
    if (!surveyAnswersList) { return []; }
    return surveyAnswersList
      .map(student => [student.studentschoolkey, student.studentname]
        .concat(surveyQuestionSummaryList
          .filter(question => !questionFilter || question.question === questionFilter)
          .map(question => student.answers[question.surveyquestionkey])
        )
      );
  }

  return <main role='main' className='container'>
    <div className='position-relative p-t-10 back-button'>
      <a className='btn-outline-nav inline-block position-relative' onClick={() => history.back()}>
        <i className='ion ion-md-arrow-dropleft f-s-37 position-absolute'></i>
      </a>
      <h1 className='inline-block position-absolute'>Survey <span>results</span></h1>
    </div>

    <SearchInSections sectionList={sectionList} onSearch={onSearchHandle} defaultValue={selectedSectionKey} />

    {(!showSearchResults) && <h1>Click "Search" to Show Results</h1>}
    {(showSearchResults) && <h1>Search Results</h1>}

    {(showSearchResults) && <div className='row' >
      <SurveyMetadataUI surveyMetadataList={surveyMetadataList}
        selectedSurveyKey={selectedSurveyMetadata ? selectedSurveyMetadata.surveykey : null}
        onSurveySelected={onSurveySelectedHandler} />
    </div>
    }

    {(selectedSurveyQuestionSummaryList) &&
      <div className='row'>
        {selectedSurveyQuestionSummaryList.map((question, index) => {
          return <div className='col-12 col-md-6' key={question.surveyquestionkey}>
            <div id='chartCard' className='card'>
              <div className='card-body'>
                <ChartAndTable
                  columns={getSurveyAnswersLabels(selectedSurveyQuestionSummaryList, question.question)}
                  dataSet={getSurveyAnswersDataset(selectedSurveyAnswers, selectedSurveyQuestionSummaryList, question.question)}
                  question={question}
                  title={<><span className={'questionIndex'}>{index + 1}) </span>{question.question}</>}
                  afterSelectionChangedHandler={(answer: string) => onSurveyAnswerSelected(answer, index)}
                />
              </div>
            </div>
          </div>;
        })
        }
      </div>
    }

    {(selectedSurveyQuestionSummaryList && selectedSurveyAnswers) && <>
      <div>
        <h1>Survey Details</h1>
      </div>
      <div className='row'>
        <div className='col-12'>
          <div className='card'>
            <div className='card-body table-responsive-md'>
              <DataTable
                columns={getSurveyAnswersLabels(selectedSurveyQuestionSummaryList)}
                dataSet={getSurveyAnswersDataset(selectedSurveyAnswers, selectedSurveyQuestionSummaryList)}
                linkBaseURL={'/#/app/studentDetail/'}
                defaultSort={1}
                highlightFilterByColumn={selectedAnswer ? {
                  columnIndex: selectedQuestionIndex + 2/* account for added columns */
                  , filter: selectedAnswer
                } : null}
                key={selectedSurveyMetadata.surveykey}
              />
            </div>
          </div>
        </div>
      </div>
    </>}
  </main>;
};
