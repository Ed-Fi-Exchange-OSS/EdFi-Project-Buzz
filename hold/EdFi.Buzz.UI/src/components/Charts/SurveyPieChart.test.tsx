// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import React from 'react';
import { render } from '@testing-library/react';
import SurveyPieChart from './SurveyPieChart';
import { SurveyQuestionType } from '../Survey/types/SurveyQuestionType';

test('renders Survey Pie Chart', () => {
  const answers: Array<SurveyQuestionType> = [
    {
      id: '1',
      question: 'Donec sagittis',
      answer: 'Yes',
    },
    {
      id: '2',
      question: 'Pellentesque ex tellus',
      answer: 'No',
    },
    {
      id: '3',
      question: 'Quisque euismod',
      answer: 'Yes',
    },
    {
      id: '4',
      question: 'Sed lacinia',
      answer: 'No',
    },
    {
      id: '4',
      question: 'Sed lacinia',
      answer: 'NR',
    },
    {
      id: '4',
      question: 'Sed lacinia',
      answer: 'NR',
    },
    {
      id: '4',
      question: 'Sed lacinia',
      answer: 'NR',
    },
    {
      id: '4',
      question: 'Sed lacinia',
      answer: 'NR',
    },
  ];

  const { getByText } = render(
    <SurveyPieChart answers={answers} question="Internet Access" questionId="1" width={300} and height={300} />,
  );

  const surveyHasQuestion = getByText('Internet Access');
  const surveyHasSurveyAnswerNo = getByText('No (2)');
  const surveyHasSurveyAnswerYes = getByText('Yes (2)');

  expect(surveyHasQuestion).toBeTruthy();
  expect(surveyHasSurveyAnswerNo).toBeTruthy();
  expect(surveyHasSurveyAnswerYes).toBeTruthy();
});
