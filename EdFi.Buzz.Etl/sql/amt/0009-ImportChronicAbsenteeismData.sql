-- SPDX-License-Identifier: Apache-2.0
-- Licensed to the Ed-Fi Alliance under one or more agreements.
-- The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
-- See the LICENSE and NOTICES files in the project root for more information.

SELECT
    studentschoolkey,
    cast(sum(ReportedAsPresentAtSchool) * 1.0 / count(DateKey) as numeric(5,2)) as reportedaspresentatschool,
    cast(sum(ReportedAsAbsentFromSchool) * 1.0 / count(DateKey) as numeric(5,2)) as reportedasabsentfromschool,
    cast(sum(ReportedAsPresentAtHomeRoom) * 1.0 / count(DateKey) as numeric(5,2)) as reportedaspresentathomeroom,
    cast(sum(ReportedAsAbsentFromHomeRoom) * 1.0 / count(DateKey) as numeric(5,2)) as reportedasabsentfromhomeroom,
    cast(sum(ReportedAsIsPresentInAllSections) * 1.0 / count(DateKey) as numeric(5,2)) as reportedasispresentinallsections,
    cast(sum(ReportedAsAbsentFromAnySection) * 1.0 / count(DateKey) as numeric(5,2)) as reportedasabsentfromanysection
FROM analytics.chrab_ChronicAbsenteeismAttendanceFact
GROUP BY StudentSchoolKey
ORDER BY StudentSchoolKey;