// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Environment } from 'Models/Environment';

export default class EnvironmentService {
  public environment: Environment;

  // We access the environment variables that were fetched before the app started
  /* eslint no-useless-constructor: "warn"*/
  constructor() {
    this.environment = {
      GQL_ENDPOINT: process.env.REACT_APP_GQL_ENDPOINT,
      GOOGLE_CLIENT_ID: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      ADFS_CLIENT_ID: process.env.REACT_APP_ADFS_CLIENT_ID,
      ADFS_TENANT_ID: process.env.REACT_APP_ADFS_TENANT_ID,
      SURVEY_MAX_FILE_SIZE_BYTES:  Number(process.env.REACT_APP_SURVEY_MAX_FILE_SIZE_BYTES),
      JOB_STATUS_FINISH_IDS: JSON.parse(process.env.REACT_APP_JOB_STATUS_FINISH_IDS)
    };
  }
}
