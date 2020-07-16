// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

const readline = require('readline');
const sql = require('mssql');
const { Pool } = require('pg');

const ROW_COUNT_TO_LOAD = 50;

function rewriteLine(text, stream) {
  readline.clearLine(stream); // clear current text
  readline.cursorTo(stream, 0); // move cursor to beginning of line
  stream.write(text);
}

const removeMapRecords = async (rowConfig, pgConfig) => {
  if (!rowConfig.isEntityMap) {
    return;
  }

  const pool = new Pool(pgConfig);
  let pgClient = {};
  try {
    pgClient = await pool.connect();
    await pgClient.query('BEGIN');
    await pgClient.query(rowConfig.deleteSql)
      .then((res) => {
        console.log(`[${rowConfig.recordType}] ${res.rowCount} records deleted`);
      });
    await pgClient.query('COMMIT');
  } catch (err) {
    await pgClient.query('ROLLBACK');
    console.error(`[${rowConfig.recordType}] removeMapRecords:\n${err.stack}`);
  } finally {
    if (pgClient.release) {
      pgClient.release();
    }
    await pool.end();
  }
};

const processEntity = async (values, pgClient, rowConfig) => {
  await pgClient
    .query(rowConfig.selectSql, [values[rowConfig.keyIndex]])
    .then(async (res) => {
      if (res.rowCount === 0) {
        await pgClient.query(rowConfig.insertSql, values)
          .catch(() => console.error(JSON.stringify(values)));
      }

      if (res.rowCount === 1) {
        await pgClient.query(rowConfig.updateSql, values)
          .catch(() => console.error(JSON.stringify(values)));
      }
    });
};

const processMappedEntity = async (values, pgClient, rowConfig) => {
  try {
    await pgClient.query(rowConfig.insertSql, values);
  } catch (error) {
    console.log(JSON.stringify(values));
    throw error;
  }
};

const processRowArray = async (rows, request, rowConfig, pgConfig) => {
  const pool = new Pool(pgConfig);
  const pgClient = await pool.connect();

  try {
    await pgClient.query('BEGIN');
    let row;
    /* eslint-disable no-await-in-loop */
    while ((row = rows.pop())) {
      const values = rowConfig.valueFunc(row);

      if (rowConfig.isEntityMap) {
        await processMappedEntity(values, pgClient, rowConfig);
      } else {
        await processEntity(values, pgClient, rowConfig);
      }
    }
    await pgClient.query('COMMIT');
    await request.resume();
  } catch (error) {
    await pgClient.query('ROLLBACK');
    console.error(`[${rowConfig.recordType}] processRowArray:\n${error.stack}`);
  } finally {
    pgClient.release();
    await pool.end();
  }
};

const processRecords = async (config, rowConfig, pgConfig) => {
  const rowsToProcess = [];
  await removeMapRecords(rowConfig, pgConfig);
  await sql.connect(config);
  const request = new sql.Request();
  request.stream = true;

  let processedRows = 0;
  let done = false;

  request.on('row', async (values) => {
    rowsToProcess.push(values);
    if (rowsToProcess.length >= ROW_COUNT_TO_LOAD) {
      processedRows += rowsToProcess.length;

      request.pause();
      await processRowArray(rowsToProcess, request, rowConfig, pgConfig);

      rewriteLine(`[${rowConfig.recordType}] Loaded records: ${processedRows}`, process.stdout);
    }
  });

  request.on('done', async () => {
    processedRows += rowsToProcess.length;

    await processRowArray(rowsToProcess, request, rowConfig, pgConfig);
    done = true;

    rewriteLine(`[${rowConfig.recordType}] Loaded records: ${processedRows}`, process.stdout);
    await sql.close();
  });

  request.on('error', async (e) => {
    console.error(`[${rowConfig.recordType}] request.error:\n${e.stack}`);
  });
  await request.query(rowConfig.sourceSql);
  /* returns before 'done' is run. To prevent that we wait */
  await (async () => {
    while (!done) {
      (await new Promise((resolve) => setTimeout(resolve, 100)));
    }
  })();
};

sql.on('error', (sqlerror) => {
  console.error(`sql.error:\n${sqlerror.stack}`);
});

const loadMsSqlData = async (pgConfig, mssqlConfig, config) => {
  console.log(`[${config.recordType}] loading....`);
  await processRecords(mssqlConfig, config, pgConfig);
  console.log(`\n[${config.recordType}] done`);
};

exports.loadMsSqlData = loadMsSqlData;
