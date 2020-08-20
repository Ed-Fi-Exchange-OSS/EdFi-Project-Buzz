-- SPDX-License-Identifier: Apache-2.0
-- Licensed to the Ed-Fi Alliance under one or more agreements.
-- The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
-- See the LICENSE and NOTICES files in the project root for more information.

SELECT DISTINCT
    ssa.staffusi as staffkey,
    CONCAT(ssa.SchoolId, '-', ssa.ClassPeriodName, '-', ssa.ClassroomIdentificationCode, '-', ssa.LocalCourseCode, '-', ssa.TermDescriptorId, '-', ses.SchoolYear, '-', ssa.UniqueSectionCode, '-', ssa.SequenceOfCourse) AS sectionkey,
    ssa.begindate as begindate,
    ssa.enddate as enddate
FROM
    edfi.StaffSectionAssociation ssa
INNER JOIN
    edfi.Session ses
    ON ssa.SchoolId = ses.SchoolId
        AND
            ssa.SchoolYear = ses.SchoolYear
        AND
            ssa.TermDescriptorId = ses.TermDescriptorId
