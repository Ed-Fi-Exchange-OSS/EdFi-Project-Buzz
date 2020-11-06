/*
 * SPDX-License-Identifier: Apache-2.0
 * Licensed to the Ed-Fi Alliance under one or more agreements.
 * The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
 * See the LICENSE and NOTICES files in the project root for more information.
 */

import * as React from 'react';
import { FunctionComponent, useEffect, useState } from 'react';
import styled from 'styled-components';
import { ChevronDownIcon, ChevronUpIcon } from '../../common/Icons';
import StudentSurvey from '../../Models/StudentSurvey';
import { StudentDetailSurveyAnswerRow } from './StudentDetailSurveyAnswers';

const StyledStudentSurveyRow = styled.div`
  display: flex;
  flex-direction: row;
  align-content: center;

  .stacked-container {
    display: flex;
    flex-direction: column;
    flex: 0 0 94%;
  }

  .survey-question-row {
    display:flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;

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
  flex: 1;
  padding-right: 1.5rem;
  padding-left: 5px;
  width: 20px;
  height: 25px;
  cursor: pointer;
`;

export interface StudentDetailSurveyProps {
  survey: StudentSurvey;
}

export const StudentDetailSurvey: FunctionComponent<StudentDetailSurveyProps> = (props: StudentDetailSurveyProps) => {
  let i = 0;
  const [survey, setSurvey] = useState<StudentSurvey>();
  const [show, setShow] = useState<boolean>(false);

  const toggleDetail = () => {
    setShow(!show);
  };

  useEffect(() => {
    setSurvey(props.survey);
  }, [props.survey]);

  return (
    <>
      {survey && (
        <>
          <StyledStudentSurveyRow>
            <div className='stacked-container'>
              <div className='h2-desktop'>{survey.survey.title}</div>
              <div className='survey-question-row'>
                <div className='bold'>Date:&nbsp;{new Date(parseInt(survey.date, 10)).toLocaleDateString()}</div>
                <div className='bold'>Questions:&nbsp;{survey.answers.length}</div>
              </div>
            </div>
            <StyledChevronIcon onClick={() => toggleDetail()} tabIndex={3} onKeyPress={() => toggleDetail()}>
              {!show ? <ChevronDownIcon /> : <ChevronUpIcon />}
            </StyledChevronIcon>
          </StyledStudentSurveyRow>
          {show && survey.answers.length > 0 && (
            <>
              <div className='h2-desktop'>QUESTIONS</div>
              {
              /* eslint no-return-assign: "off"*/
                survey.answers.map((a, index) => (
                  <StudentDetailSurveyAnswerRow key={index} idx={i += 1} answer={a} />
                ))}
            </>
          )}
        </>
      )}
    </>
  );
};
