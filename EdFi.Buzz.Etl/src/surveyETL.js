// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

/* eslint no-param-reassign: ["error", { "props": false }] */
const dotnet = require('dotenv');

dotnet.config();
const path = require('path');
const surveyProcessor = require('../processors/surveyProcessor');

function getArgs(argv) {
  const args = {
    debug: true,
    help: false,
    filename: '../surveySampleData/InternetAccessSurvey.csv',
    surveyTitle: 'Internet Access',
  };

  if (argv[2] === '--help' || argv[2] === '-h') {
    args.help = true;
    return args;
  }

  if (argv.length > 4 || argv.length < 4) {
    args.help = !args.debug && argv.length < 4;
    return args;
  }

  [, , args.filename, args.surveyTitle] = argv;

  return args;
}

async function main() {
  const args = getArgs(process.argv);

  if (args.help) {
    console.log(`Usage: node ${path.basename(process.argv[1])} [-h | --help] | filename surveyTitle`);
    return;
  }

  console.time('Load survey time');
  await surveyProcessor.process(args.surveyTitle, args.filename);
  console.timeEnd('Load survey time');
}

main();
