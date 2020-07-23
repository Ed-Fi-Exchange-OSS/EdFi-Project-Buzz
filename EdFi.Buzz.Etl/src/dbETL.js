// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

const dotnet = require('dotenv');

dotnet.config();

const config = require('../config/dbs');
const etl = require('../config/etl');
const loadMsSqlData = require('./loadMsSqlData');

const pg = config.pgConfig;
const ms = config.mssqlConfig;

const loadBaseEntities = async () => {
  try {
    console.log(`loading records from ${process.env.BUZZ_SQLSOURCE}`);
    await loadMsSqlData.loadMsSqlData(pg, ms, etl.schoolConfig);
    await loadMsSqlData.loadMsSqlData(pg, ms, etl.studentSchoolConfig);
    await loadMsSqlData.loadMsSqlData(pg, ms, etl.contactPersonConfig);
    await loadMsSqlData.loadMsSqlData(pg, ms, etl.sectionConfig);
    await loadMsSqlData.loadMsSqlData(pg, ms, etl.staffConfig);
    await loadMsSqlData.loadMsSqlData(pg, ms, etl.staffSectionConfig);
    await loadMsSqlData.loadMsSqlData(pg, ms, etl.studentSectionConfig);
    await loadMsSqlData.loadMsSqlData(pg, ms, etl.studentContactConfig);
    console.log('finished loading entities');
  } catch (error) {
    console.error(error);
  }
};

loadBaseEntities();
