// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { RadioButtonProps } from '../utilities/input/radioButton/RadioButtonTypes';

const AdvancedSearchData: {
  studentSelectionData: RadioButtonProps;
  surveysList?: Array<RadioButtonProps>;
} = {
  studentSelectionData: {
    inputLabel: 'Student Selection',
    inputName: 'studentSelection',
    options: [
      {
        radioLabel: 'All Accessible Students',
        value: 'All Accessible Students',
      },
      {
        radioLabel: 'All Classes',
        value: 'All Classes',
      },
      {
        radioLabel: 'Single Class',
        value: 'Single Class',
      },
    ],
  },
  surveysList: [
    {
      inputLabel: 'Internet Access Survey',
      inputName: 'InternetAccessSurvey',
      options: [
        {
          radioLabel: 'High Speed Internet',
          value: 'HighSpeedInternet',
        },
        {
          radioLabel: 'Internet Access Type',
          value: 'InternetAccessType',
        },
        {
          radioLabel: 'Dedicated Computer',
          value: 'DedicatedComputer',
        },
      ],
    },
    {
      inputLabel: 'Classroom Engagement',
      inputName: 'ClassroomEngagement',
      options: [
        {
          radioLabel: 'Used Google Classroom',
          value: 'UsedGoogleClassroom',
        },
        {
          radioLabel: 'Used Zoom meetings',
          value: 'UsedZoomMeetings',
        },
        {
          radioLabel: 'Posted Assignments',
          value: 'Posted Assignments',
        },
      ],
    },
  ],
};

export default AdvancedSearchData;
