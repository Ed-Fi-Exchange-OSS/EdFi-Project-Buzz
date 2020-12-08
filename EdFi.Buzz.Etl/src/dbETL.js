// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

const dotnet = require('dotenv');

dotnet.config();

const config = require('../config/dbs');
const etl = require('../config/etl');
const loadMsSqlData = require('./loadMsSqlData');
const odsSurveyProcessor = require('../processors/odsSurveyProcessor');
const dsHelper = require('../config/dsHelper');

const pg = config.pgConfig;
const ms = config.mssqlConfig;

const loadBaseEntities = async () => {
  try {
    console.log(`loading records from ${process.env.BUZZ_SQLSOURCE}`);

    await etl.dbDataStandard(ms);

    await loadMsSqlData.loadMsSqlData(pg, ms, etl.schoolConfig);
    await loadMsSqlData.loadMsSqlData(pg, ms, etl.studentSchoolConfig);
    await loadMsSqlData.loadMsSqlData(pg, ms, etl.contactPersonConfig);
    await loadMsSqlData.loadMsSqlData(pg, ms, etl.sectionConfig);
    await loadMsSqlData.loadMsSqlData(pg, ms, etl.staffConfig);
    await loadMsSqlData.loadMsSqlData(pg, ms, etl.staffSectionConfig());
    await loadMsSqlData.loadMsSqlData(pg, ms, etl.studentSectionConfig);
    await loadMsSqlData.loadMsSqlData(pg, ms, etl.studentContactConfig);
    await loadMsSqlData.loadMsSqlData(pg, ms, etl.studentAssessmentsConfig);
    await loadMsSqlData.loadMsSqlData(pg, ms, etl.demographicsConfig);
    await loadMsSqlData.loadMsSqlData(pg, ms, etl.studentDemographicsConfig);

    if (process.env.BUZZ_SQLSOURCE === 'amt') {
      const viewExists = await dsHelper.chronicAbsenteeismAttendanceFactExists(ms);
      if (viewExists === 'yes') {
        await loadMsSqlData.loadMsSqlData(pg, ms, etl.studentAttendanceConfig);
      } else {
        console.log('chrab_ChronicAbsenteeismAttendanceFact is not installed');
      }
    }

    console.log('finished loading entities');

    if (process.env.KeepSurveysSynch && process.env.KeepSurveysSynch.toLowerCase() === 'true') {
      await odsSurveyProcessor.processAll();
    }
  } catch (error) {
    console.error(error);
  }
};

loadBaseEntities();
