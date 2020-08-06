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
    staffkey: 1030,
    surveykey: 1,
    uploadsurvey: false,
    surveytitle: 'Contact',
    filename: 'staffkey-1030-ContactSurvey.csv',
    filePath: '../surveySampleData/',
    jobkey: '123456789abcdef',
  };

  if (argv[2] === '--help' || argv[2] === '-h') {
    args.help = true;
    return args;
  }

  if (argv.length > 9 || argv.length < 9) {
    args.help = !args.debug && argv.length < 9;
    return args;
  }

  [, , args.staffkey, args.surveykey,
    args.uploadsurvey, args.surveytitle,
    args.filename, args.filePath,
    args.jobkey] = argv;

  return args;
}

async function main() {
  const args = getArgs(process.argv);

  if (args.help) {
    console.log(`Usage: node ${path.basename(process.argv[1])} [-h | --help] | filename surveyTitle`);
    return;
  }

  console.time('Load survey time');
  await surveyProcessor.process(args.staffkey, args.surveykey,
    args.uploadsurvey, args.surveytitle, args.filename, args.filePath,
    args.jobkey, console);
  console.timeEnd('Load survey time');
}

main();
