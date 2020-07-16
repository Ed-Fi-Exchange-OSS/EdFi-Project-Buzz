// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import SurveyRosterModal from './SurveyRosterModal';
import { SurveyClassType } from './types/SurveyClassType';

test('renders Survey Modal', () => {
  const sectionSurveys: Array<SurveyClassType> = [
    {
      surveyKey: '1',
      sectionKey: '1',
      surveyName: 'Test Survey',
    },
  ];

  const { getByText, getByDisplayValue } = render(<SurveyRosterModal surveys={sectionSurveys} />);
  fireEvent.click(getByText('Class Survey Results'));

  const surveyHasSurveyKey = getByDisplayValue(`${sectionSurveys[0].sectionKey}/${sectionSurveys[0].surveyKey}`);
  const surveyHasSurveyName = getByText(sectionSurveys[0].surveyName);

  expect(surveyHasSurveyKey).toBeTruthy();
  expect(surveyHasSurveyName).toBeTruthy();
});
