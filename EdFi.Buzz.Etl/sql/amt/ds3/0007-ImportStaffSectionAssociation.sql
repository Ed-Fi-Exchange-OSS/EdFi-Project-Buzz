-- SPDX-License-Identifier: Apache-2.0
-- Licensed to the Ed-Fi Alliance under one or more agreements.
-- The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
-- See the LICENSE and NOTICES files in the project root for more information.

SELECT DISTINCT
    ssa.staffusi as staffkey,
    CAST(ssa.SchoolId AS NVARCHAR) + '-' + ssa.LocalCourseCode + '-' + CAST(ssa.SchoolYear AS NVARCHAR) + '-' + ssa.SectionIdentifier + '-' + ssa.SessionName AS sectionkey,
    ssa.begindate as begindate,
    ssa.enddate as enddate
FROM edfi.StaffSectionAssociation ssa