// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

export default class Environment {
  GQL_ENDPOINT: string;

  GOOGLE_CLIENT_ID?: string;

  ADFS_CLIENT_ID?: string;

  ADFS_TENANT_ID?: string;

  SURVEY_MAX_FILE_SIZE_BYTES: number;

  JOB_STATUS_FINISH_IDS: number[]; /* error and complete status */

  TITLE: string;

  EXTERNAL_LOGO: string;

  LOGO: string;

  LOGIN_LOGO_WIDTH: string;

  TITLE_LOGO: string;

  TITLE_LOGO_WIDTH: string;

  TITLE_LOGO_HEIGHT: string;

}
