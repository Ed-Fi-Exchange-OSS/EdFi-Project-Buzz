
// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import gql from 'graphql-tag';

const uploadSurvey = gql`
mutation ($staffkey: ID!, $content: String!, $title: String!, $surveykey: Int) {
  uploadsurvey(staffkey: $staffkey, content: $content, title: $title, surveykey: $surveykey) {
    surveystatuskey
    staffkey
    surveykey
    jobkey
    jobstatuskey
    resultsummary
    jobstatus {
      jobstatuskey
      description
    }
  }
}
`;

const deleteSurvey = gql`
mutation ($staffkey: ID!, $surveykey: Int!) {
  deletesurvey(staffkey: $staffkey, surveykey: $surveykey){
    surveykey
  }
}
`;

export { uploadSurvey, deleteSurvey };
