/*
 * SPDX-License-Identifier: Apache-2.0
 * Licensed to the Ed-Fi Alliance under one or more agreements.
 * The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
 * See the LICENSE and NOTICES files in the project root for more information.
 */

import * as React from 'react';
import { FunctionComponent, useEffect, useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '../common/Icons';
import { StudentSurvey, StudentSurveySummaryAnswers } from 'src/app/Models/student';
import styled from 'styled-components';
import { StudentDetailSurveyAnswerRow } from './StudentDetailSurveyAnswers';

const StyledStudentSurveyRow = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  & > div {
    @media (min-width: 769px) {
      flex: 1;
      display: flex;
    }

    @media (max-width: 768px) {
      flex: 0 0 100%;
    }
  }

  .survey-question-row {
    display:flex;
    flex-direction: row;
    justify-content: space-between;
    
    & > div {
      flex: 1;
    }
  }

  .shown-div {
    display: flex;
    flex: 1;
  }

  .hide-div {
    display: none;
  }
`;

const StyledChevronIcon = styled.div`
  display: flex;
  flex: 1;
  justify-content: flex-end;
  padding-right: 1.5rem;
  width: 22px;
  height: 12px;
  cursor: pointer;
`;

export interface StudentDetailSurveyProps {
  survey: StudentSurvey;
}

export const StudentDetailSurvey: FunctionComponent<StudentDetailSurveyProps> = (props: StudentDetailSurveyProps) => {
  let i = 0;
  const [survey, setSurvey] = useState<StudentSurvey>();
  const [show, setShow] = useState<Boolean>(false);

  const toggleDetail = () => {
    setShow(!show);
  };

  useEffect(() => {
    setSurvey(props.survey);
  }, []);

  return (
    <>
      {survey && (
        <>
          <StyledStudentSurveyRow>
            <div className="h2-desktop">{survey.survey.title}</div>
            <div className="survey-question-row">
              <div className="bold">Date:&nbsp;{new Date(parseInt(survey.date, 10)).toLocaleDateString()}</div>
              <div className="bold">Questions:&nbsp;{survey.answers.length}</div>
            </div>
            <StyledChevronIcon onClick={(e) => toggleDetail()}>
              {!show ? <ChevronDownIcon /> : <ChevronUpIcon />}
            </StyledChevronIcon>
          </StyledStudentSurveyRow>
          {show && survey.answers.length > 0 && (
            <>
              <div className="h2-desktop">QUESTIONS</div>
              {survey.answers.map((a, index) => (
                <StudentDetailSurveyAnswerRow key={index} idx={++i} answer={a} />
              ))}
            </>
          )}
        </>
      )}
    </>
  );
};
