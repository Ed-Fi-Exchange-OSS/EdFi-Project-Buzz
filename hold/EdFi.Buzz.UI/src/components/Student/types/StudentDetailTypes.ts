// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { StudentDetailGuardianType } from './StudentDetailGuardianType';
import { StudentDetailSiblingType } from './StudentDetailSiblingType';
import { SurveyQuestionType } from '../../Survey/types/SurveyQuestionType';

export type StudentDetailSurveyType = {
  id: string;
  name: string;
  date: string;
  questions: Array<SurveyQuestionType>;
};

export type StudentDetailType = {
  id: string;
  firstName: string;
  lastName: string;
  middleName: string;
  pictureurl: string;
  email: string;
  guardians: Array<StudentDetailGuardianType>;
  surveys?: Array<StudentDetailSurveyType>;
  siblings?: Array<StudentDetailSiblingType>;
  hasEmail: boolean;
  hasAccessToGoogleClassroom: boolean;
  hasInternetAccess: boolean;
  hasPhone: boolean;
};
