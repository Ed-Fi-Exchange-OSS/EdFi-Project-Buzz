-- SPDX-License-Identifier: Apache-2.0
-- Licensed to the Ed-Fi Alliance under one or more agreements.
-- The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
-- See the LICENSE and NOTICES files in the project root for more information.

SELECT DISTINCT
    CAST(s.SchoolId AS NVARCHAR) + '-' + s.LocalCourseCode + '-' + CAST(s.SchoolYear AS NVARCHAR) + '-' + s.SectionIdentifier + '-' + s.SessionName AS sectionkey,
    s.schoolid as schoolkey,
    s.localcoursecode,
    s.sessionname,
    s.sectionidentifier,
    s.schoolyear
FROM edfi.SectionClassPeriod s
