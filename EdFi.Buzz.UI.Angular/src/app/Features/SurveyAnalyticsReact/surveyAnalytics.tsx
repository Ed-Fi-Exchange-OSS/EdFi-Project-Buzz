import * as React from 'react';
import { FunctionComponent, useEffect, useRef, useState } from 'react';

import { ApiService } from 'src/app/Services/api.service';
import { SearchInSections } from 'src/app/Components/SearchInSectionsUIReact/searchInSections';
import { Section, SurveyMetadata, SurveyQuestionSummary } from 'src/app/Models';

import { SurveyMetadataUI } from './surveyMetadataUI';
import { SurveySummary } from './surveySummary';
import { SurveyChart } from './surveyChart';
import { DataTable, ColumnOption } from 'src/app/Components/DataTable/dataTable';
import { AllStudentAnswers } from 'src/app/Models/survey';
import { VariablesAreInputTypesRule } from 'graphql';

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
  const [selectedQuestion, setSelectedQuestion] = useState(null as SurveyQuestionSummary);
  const [selectedAnswer, setSelectedAnswer] = useState(null as string);
  const [selectedSurveyAnswers, setSelectedSurveyAnswers] = useState(null as AllStudentAnswers[]);
  const [viewAnswersByStudent, setViewAnswersByStudent] = useState(false);


  function resetSelectedSurvey() {
    setSelectedSurveyMetadata(null);
    setSelectedSurveyQuestionSummaryList(null);
    setSelectedSurveyAnswers(null);
    setSelectedQuestion(null);
    setSelectedAnswer(null);
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
        setSelectedQuestion(response[0]);
      });

    props.api.surveyAnalytics
      .getAllSurveyAnswers(surveyMetadata.surveykey, surveyMetadata.sectionkey)
      .then(response => setSelectedSurveyAnswers(response));
  }

  function onSurveyQuestionSelectedHandler(surveyName: string, surveyQuestion: SurveyQuestionSummary) {
    setSelectedQuestion(surveyQuestion);
  }

  function onAnswerSelectionChangedHandler(answer: string) {
    setSelectedAnswer(answer);
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
    return surveyAnswersList
      .map(student => [student.studentschoolkey, student.studentname]
        .concat(surveyQuestionSummaryList
          .filter(question => !questionFilter || question.question === questionFilter)
          .map(question => student.answers[question.surveyquestionkey])
        )
      );
  }
  function getSurveyQuetionSummaryIndex(surveyQuestion: SurveyQuestionSummary) {
    const index = selectedSurveyQuestionSummaryList.findIndex(value => value.question === surveyQuestion.question);
    return index;
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
        <SurveySummary
          surveyName={selectedSurveyMetadata.title}
          surveyQuestionSummaryList={selectedSurveyQuestionSummaryList}
          onSurveyQuestionSelected={onSurveyQuestionSelectedHandler} />

        {(selectedQuestion) &&
          <div className='col-12 col-md-6'>
            <div id='chartCard' className='card'>
              <div className='card-body'>
                <SurveyChart title={`Selected Question: ${selectedQuestion.question}`}
                  question={selectedQuestion}
                  afterSelectionChangedHandler={onAnswerSelectionChangedHandler} />

                <div onClick={() => setViewAnswersByStudent(!viewAnswersByStudent)} className={'view-answers-by-student'}>
                  View answers by student <span className={viewAnswersByStudent ? 'ion-md-arrow-dropup-circle' : 'ion-md-arrow-dropdown-circle'}></span>
                </div>

                {(viewAnswersByStudent && selectedQuestion) && <DataTable
                  columns={getSurveyAnswersLabels(selectedSurveyQuestionSummaryList, selectedQuestion.question)}
                  dataSet={getSurveyAnswersDataset(selectedSurveyAnswers, selectedSurveyQuestionSummaryList, selectedQuestion.question)}
                  linkBaseURL={'/#/app/studentDetail/'}
                  defaultSort={1}
                  alwaysSortLastByColumn={1}
                  filterByColumn={selectedAnswer ? { columnIndex: 2, filter: selectedAnswer } : null}
                  key={selectedQuestion.question}
                />
                }
              </div>
            </div>
          </div>
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
                  columnIndex: getSurveyQuetionSummaryIndex(selectedQuestion) + 2/* account for added columns */
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
