// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { SurveyQuestionType } from '../../Survey/types/SurveyQuestionType';

export type PieChartProps = {
  questionId: string;
  question: string;
  answers: Array<SurveyQuestionType>;
  radius?: number;
  width?: number;
  height?: number;
  posX?: number;
  posY?: number;
};

export type PieChartDataItem = {
  name: string;
  value: number;
};
