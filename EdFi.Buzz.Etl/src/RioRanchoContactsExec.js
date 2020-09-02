// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

/* eslint no-param-reassign: ["error", { "props": false }] */
const dotnet = require('dotenv');

dotnet.config();
const processor = require('../processors/RioRanchoContactsProcessor');

async function main() {
  console.time('Load time');
  await processor.process(process.argv[2]);
  console.timeEnd('Load time');
}

main();
