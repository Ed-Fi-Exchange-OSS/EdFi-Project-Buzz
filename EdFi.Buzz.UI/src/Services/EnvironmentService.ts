// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Environment } from '../Models/Environment';

export class EnvironmentService {
    public environment: Environment;
    // We access the environment variables that were fetched before the app started
    constructor() {
        this.environment = window['tempConfigStorage'] as Environment;
        window['tempConfigStorage'] = null;
    }
}
