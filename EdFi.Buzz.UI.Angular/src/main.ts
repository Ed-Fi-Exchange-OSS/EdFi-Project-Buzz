// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

export function getBaseUrl() {
  return document.getElementsByTagName('base')[0].href;
}

const providers = [
  { provide: 'BASE_URL', useFactory: getBaseUrl, deps: [] }
];

// Angular don't have async factory support, so we need to do this async task before starting the app
fetch('assets/environment.json')
  .then(async response => {
    return await response.json();
  })
  .then(config => {
      if (!config) {
        console.error('Error loading environment variables');
          return;
      }
      window['tempConfigStorage'] = config;

      if (environment.production) {
        enableProdMode();
      }

      platformBrowserDynamic(providers).bootstrapModule(AppModule)
        .catch((err: any) => console.log(err));
  })
  .catch(console.error);
