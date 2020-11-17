-- SPDX-License-Identifier: Apache-2.0
-- Licensed to the Ed-Fi Alliance under one or more agreements.
-- The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
-- See the LICENSE and NOTICES files in the project root for more information.

CREATE TABLE buzz.Attendance (
    StudentSchoolKey VARCHAR(45) NOT NULL,
    StudentKey VARCHAR(32) NOT NULL,
    SchoolKey VARCHAR(30) NOT NULL,
    ReportedAsPresentAtSchool NUMERIC(5,2) NOT NULL DEFAULT 0,
    ReportedAsAbsentFromSchool NUMERIC(5,2) NOT NULL DEFAULT 0,
    ReportedAsAbsentFromSchoolReportedAsPresentAtHomeRoom NUMERIC(5,2) NOT NULL DEFAULT 0,
    ReportedAsAbsentFromHomeRoom NUMERIC(5,2) NULL DEFAULT 0,
    ReportedAsIsPresentInAllSections NUMERIC(5,2) NOT NULL DEFAULT 0,
    ReportedAsAbsentFromAnySection NUMERIC(5,2) NOT NULL  DEFAULT 0,
    CONSTRAINT PK_AttendanceKey PRIMARY KEY (StudentSchoolKey)
);
