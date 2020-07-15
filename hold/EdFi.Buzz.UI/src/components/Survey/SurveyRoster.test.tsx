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
