-- SPDX-License-Identifier: Apache-2.0
-- Licensed to the Ed-Fi Alliance under one or more agreements.
-- The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
-- See the LICENSE and NOTICES files in the project root for more information.

SELECT DISTINCT
	CONCAT(p.parentuniqueid, '-', s.StudentUniqueId) as uniquekey,
	CONCAT(s.StudentUniqueId, '-', ssa.SchoolId) as studentkey
From edfi.Student s
    INNER JOIN
        edfi.StudentSchoolAssociation ssa ON
            S.StudentUSI = ssa.StudentUSI
            INNER JOIN edfi.StudentParentAssociation spa ON ssa.StudentUSI = spa.StudentUSI
                INNER JOIN edfi.Parent p ON spa.ParentUSI = p.ParentUSI
WHERE(
    ssa.ExitWithdrawDate IS NULL
    OR ssa.ExitWithdrawDate >= GETDATE());
