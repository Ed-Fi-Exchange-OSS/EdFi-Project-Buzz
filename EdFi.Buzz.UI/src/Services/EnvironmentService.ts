// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import Environment from 'Models/Environment';

export default class EnvironmentService {
  public environment: Environment;

  constructor() {
    var runConfig = window['runConfig'];

    this.environment = {
      GQL_ENDPOINT: runConfig.REACT_APP_GQL_ENDPOINT || process.env.REACT_APP_GQL_ENDPOINT,
      GOOGLE_CLIENT_ID: runConfig.REACT_APP_GOOGLE_CLIENT_ID || process.env.REACT_APP_GOOGLE_CLIENT_ID,
      ADFS_CLIENT_ID: runConfig.REACT_APP_ADFS_CLIENT_ID || process.env.REACT_APP_ADFS_CLIENT_ID,
      ADFS_TENANT_ID: runConfig.REACT_APP_ADFS_TENANT_ID || process.env.REACT_APP_ADFS_TENANT_ID,
      SURVEY_MAX_FILE_SIZE_BYTES:  Number(runConfig.REACT_APP_SURVEY_MAX_FILE_SIZE_BYTES|| '1048576'),
      JOB_STATUS_FINISH_IDS: JSON.parse(runConfig.REACT_APP_JOB_STATUS_FINISH_IDS || '[3]'),
      TITLE: runConfig.REACT_APP_TITLE || process.env.REACT_APP_TITLE,
      EXTERNAL_LOGO: runConfig.REACT_APP_EXTERNAL_LOGO || process.env.REACT_APP_EXTERNAL_LOGO,
      LOGO: runConfig.REACT_APP_LOGO || process.env.REACT_APP_LOGO,
      LOGIN_LOGO_WIDTH: runConfig.REACT_APP_LOGO_WIDTH || process.env.REACT_APP_LOGO_WIDTH,
      TITLE_LOGO: runConfig.REACT_APP_TITLE_LOGO || process.env.REACT_APP_TITLE_LOGO,
      TITLE_LOGO_WIDTH: runConfig.REACT_APP_TITLE_LOGO_WIDTH || process.env.REACT_APP_TITLE_LOGO_WIDTH,
      TITLE_LOGO_HEIGHT: runConfig.REACT_APP_TITLE_LOGO_HEIGHT || process.env.REACT_APP_TITLE_LOGO_HEIGHT
    };
  }
}
