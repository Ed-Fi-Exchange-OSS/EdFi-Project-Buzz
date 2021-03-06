// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import gql from 'graphql-tag';

const odssurveys = gql`
  query {
    odssurveys {
      surveyidentifier
      surveytitle
    }
  }
`;

const canLoadSurverysFromUI = gql`
  query {
    canLoadSurverysFromUI {
      allowed
    }
  }
`;

const doesOdsContainsSurveyModel = gql`
  query {
    doesOdsContainsSurveyModel {
      contains
    }
  }
`;

export { odssurveys, canLoadSurverysFromUI, doesOdsContainsSurveyModel };
