// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import Environment from '../Models/Environment';

export default class EnvironmentService {
  public environment: Environment;

  // We access the environment variables that were fetched before the app started
  /* eslint no-useless-constructor: "off"*/
  constructor() {
    // eslint-disable-next-line
    this.environment = window['tempConfigStorage'] as Environment;
    // eslint-disable-next-line
    window['tempConfigStorage'] = null;
  }
}
