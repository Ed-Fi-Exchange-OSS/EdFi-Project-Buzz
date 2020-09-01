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
  idx: number;
  answer: StudentSurveySummaryAnswers;
}

const StyledAnswerRow = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  border-bottom: 1px solid var(--iron);

  & > div:first-child {
    font-weight: bold;
  }

  & > div {
    margin-right: 1.5rem;
    margin-bottom: 1rem;
  }

  .blue-number {
    font-weight: 600;
    color: var(--picton-blue);
    padding-right: 1rem;
  }
`;

export const StudentDetailSurveyAnswerRow: FunctionComponent<StudentDetailSurveyAnswerRowProps> = (
  props: StudentDetailSurveyAnswerRowProps,
) => {
  return (
    <>
      {props.answer && (
        <StyledAnswerRow>
          <div><span className='blue-number'>{props.idx})</span>{props.answer.question}</div>
          <div>{props.answer.answer}</div>
        </StyledAnswerRow>
      )}
    </>
  );
};
