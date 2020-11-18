// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

const sql = require('mssql');

const dbDataStandard = async (config) => {
  try {
    await sql.connect(config);
    const result = await sql.query`
            IF (SELECT OBJECT_ID('edfi.AddressType')) IS NOT NULL 
            BEGIN
                SELECT 'ds2' AS version
            END
            ELSE IF (SELECT OBJECT_ID('dbo.VersionLevel')) IS NOT NULL OR (SELECT OBJECT_ID('dbo.DeployJournal')) IS NOT NULL 
            BEGIN
                SELECT 'ds3' AS version
            END
            ELSE
            BEGIN
                SELECT 'InvalidDs' AS version
            END
        `;

    if (result.recordset && result.recordset.length > 0) return result.recordset[0].version;

    return undefined;
  } catch (err) {
    return undefined;
  }
};

const chronicAbsenteeismAttendanceFactExists = async (config) => {
  try {
    await sql.connect(config);
    const result = await sql.query`
        IF EXISTS
        (
            SELECT 1
            FROM INFORMATION_SCHEMA.VIEWS
            WHERE TABLE_SCHEMA = 'analytics'
                  AND TABLE_NAME = 'chrab_ChronicAbsenteeismAttendanceFact'
        )
        BEGIN
            SELECT 'yes' AS 'exists'
        END
        ELSE BEGIN
            SELECT 'no' AS 'exists'
        END
        `;

    if (result.recordset && result.recordset.length > 0) return result.recordset[0].exists;

    return undefined;
  } catch (err) {
    return undefined;
  }
};

exports.dbDataStandard = dbDataStandard;
exports.chronicAbsenteeismAttendanceFactExists = chronicAbsenteeismAttendanceFactExists;
