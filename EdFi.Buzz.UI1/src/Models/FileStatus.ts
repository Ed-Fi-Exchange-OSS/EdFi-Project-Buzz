// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { SurveyStatus } from './Survey';

export class FileStatus {
  fileName: string;
  isValid: boolean;
  status: string;
  error?: string;
  jobId?: string;
  serverJobStatus?: SurveyStatus;
}
