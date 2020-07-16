// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import StudentSurveyAnswerModal from './StudentSurveyAnswerModal';
import { SurveyDefinitionType } from './types/SurveyDefinitionType';
import { SurveyQuestionType } from './types/SurveyQuestionType';

test('renders Student Survey Answer Modal', () => {
  const studentId = '1';
  const studentName = 'One Student Doe';
  const surveyDefinition: SurveyDefinitionType = {
    surveykey: '1',
    surveyname: 'Survey Description (survey source)',
    questions: [
      {
        id: '1',
        question: 'Internet Access Type',
        answer: '',
      },
    ],
  };
  const question: SurveyQuestionType = {
    id: '1',
    question: '',
    answer: 'High Speed Internet',
    comments: 'Bandwidth: 100MB',
  };

  const { getByText } = render(
    <StudentSurveyAnswerModal
      studentId={studentId}
      studentName={studentName}
      surveyDefinition={surveyDefinition}
      studentanswer={question}
    />,
  );

  const surveyHasAnswer = getByText(question.answer);
  fireEvent.click(surveyHasAnswer);
  const surveyHasQuestion = getByText(surveyDefinition.questions[0].question);
  const surveyHasStudentName = getByText(studentName);
  const surveyHasComments = getByText(question.comments);
  expect(surveyHasAnswer).toBeTruthy();
  expect(surveyHasQuestion).toBeTruthy();
  expect(surveyHasStudentName).toBeTruthy();
  expect(surveyHasComments).toBeTruthy();
});
