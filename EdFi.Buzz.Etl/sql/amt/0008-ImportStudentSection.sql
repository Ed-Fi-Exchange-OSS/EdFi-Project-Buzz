-- SPDX-License-Identifier: Apache-2.0
-- Licensed to the Ed-Fi Alliance under one or more agreements.
-- The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
-- See the LICENSE and NOTICES files in the project root for more information.

SELECT DISTINCT
 ssd.studentsectionkey,
 CONCAT(ssd.StudentKey, '-', ssd.SchoolKey) as studentschoolkey,
 ssd.studentkey,
 ssd.sectionkey,
 ssd.localcoursecode,
 ssd.subject,
 ssd.coursetitle,
 ssd.teachername,
 ssd.studentsectionstartdatekey,
 ssd.studentsectionenddatekey,
 ssd.schoolkey,
 ssd.schoolyear
FROM analytics.StudentSectionDim ssd;
