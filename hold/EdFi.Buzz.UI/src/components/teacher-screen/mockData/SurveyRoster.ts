// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { SurveyClassType } from '../../Survey/types/SurveyClassType';

const SurveyListFirstSection: Array<SurveyClassType> = [
  {
    surveyKey: '1',
    surveyName: 'Survey Description (survey source)',
    sectionKey: '1',
  },
  {
    surveyKey: '2',
    surveyName: 'Internet Accessibility Survey (surveymonkey)',
    sectionKey: '1',
  },
  {
    surveyKey: '11',
    surveyName: '3 Week Wll-Check (LMS)',
    sectionKey: '1',
  },
  {
    surveyKey: '3',
    surveyName: '6 Week Well-Check (Excel)',
    sectionKey: '1',
  },
];
const SurveyListSecondSection: Array<SurveyClassType> = [
  {
    surveyKey: '1',
    surveyName: 'Survey Description (survey source)',
    sectionKey: '1',
  },
  {
    surveyKey: '3',
    surveyName: '8 Week (Lorem Ipsum Survey)',
    sectionKey: '2',
  },
  {
    surveyKey: '5',
    surveyName: '2 Week (Phasellus)',
    sectionKey: '2',
  },
  {
    surveyKey: '4',
    surveyName: 'Vestibulum tincidunt (Maecenas)',
    sectionKey: '2',
  },
];

const surveysList: {
  '1': Array<SurveyClassType>;
  '2': Array<SurveyClassType>;
} = {
  '1': SurveyListFirstSection,
  '2': SurveyListSecondSection,
};

export default surveysList;
