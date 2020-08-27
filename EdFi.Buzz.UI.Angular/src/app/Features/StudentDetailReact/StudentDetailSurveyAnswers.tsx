/*
 * SPDX-License-Identifier: Apache-2.0
 * Licensed to the Ed-Fi Alliance under one or more agreements.
 * The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
 * See the LICENSE and NOTICES files in the project root for more information.
 */

import { FunctionComponent } from 'react';
import * as React from 'react';
import { StudentSurveySummaryAnswers } from 'src/app/Models/student';
import styled from 'styled-components';

export interface StudentDetailSurveyAnswerRowProps {
  key: number;
  answer: StudentSurveySummaryAnswers;
}

const StyledAnswerRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  border: none !important;

  & > div {
    margin-right: 1.5rem;
  }
`;

export const StudentDetailSurveyAnswerRow: FunctionComponent<StudentDetailSurveyAnswerRowProps> = (
  props: StudentDetailSurveyAnswerRowProps,
) => {
  return (
    <>
      {props.answer && (
        <StyledAnswerRow key={props.key}>
          <div><span className='bold'>Question: </span>{props.answer.question}</div>
          <div><span className='bold'>Answer: </span>{props.answer.answer}</div>
        </StyledAnswerRow>
      )}
    </>
  );
};
