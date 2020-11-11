// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import * as React from 'react';
import styled from 'styled-components';
import SurveyQuestionSummary from 'Models/SurveyQuestionSummary';
import { createRef, useEffect } from 'react';
import { SurveyChart } from './surveyChart';
import SurveyWordCloud from './surveyWordCloud';
import { DataTable , ColumnOption } from '../../Components/DataTable/dataTable';
import ChevronDown from '../../assets/chevron-down.png';
import ChevronUp from '../../assets/chevron-up.png';



export interface ChartAndTableComponentProps {
  question: SurveyQuestionSummary;
  columns: string[] | ColumnOption[];
  dataSet: string[][];
  title?: string | React.ReactElement;
  index?: number ;
  afterSelectionChangedHandler?: (newSelection: string) => void;
}

const StyledSurveyArea = styled.div`
    cursor: pointer;
    font: ${(props) => props.theme.fonts.bold} !important;
    color: var(--picton-blue) !important;
    & img {
      justify-self: center;
      align-self: center;
      margin: 10px 10px 10px 10px;
      width: 14px;
      height: 8px;
    }

    @media (max-width: 768px){
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--iron);
    }
`;

export const ChartAndTable: React.FunctionComponent<ChartAndTableComponentProps> = (props: ChartAndTableComponentProps) => {
  const selectedQuestion = props.question;
  const [viewAnswersByStudent, setViewAnswersByStudent] = React.useState(false);
  const [selectedAnswer, setSelectedAnswer] = React.useState(null as string);
  const surveyViewDetailRef = createRef<HTMLDivElement>();

  useEffect(() => {
    if(props.index===0){
      surveyViewDetailRef.current.focus();
    }
  }, [props.index,surveyViewDetailRef]);

  function onAnswerSelectionChangedHandler(answer: string) {
    setSelectedAnswer(answer);
    if (props.afterSelectionChangedHandler) {
      props.afterSelectionChangedHandler(answer);
    }
  }

  return <>
    {selectedQuestion.answers.length < 10 &&
    <SurveyChart title={props.title}
      question={selectedQuestion}
      afterSelectionChangedHandler={onAnswerSelectionChangedHandler} />
    }
    {selectedQuestion.answers.length >= 10 &&
    <SurveyWordCloud title={props.title}
      question={selectedQuestion}
      afterSelectionChangedHandler={onAnswerSelectionChangedHandler}
    />
    }
    <StyledSurveyArea
      tabIndex={3}
      onClick={() => setViewAnswersByStudent(!viewAnswersByStudent)}
      onKeyPress={(event) => event.key === 'Enter' ? setViewAnswersByStudent(!viewAnswersByStudent) : null}
      className={'view-answers-by-student'}
      ref={surveyViewDetailRef}
    >
      <div>View Answers by Student<img src={!viewAnswersByStudent ? ChevronDown : ChevronUp} alt=""/></div>
    </StyledSurveyArea>

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
