-- SPDX-License-Identifier: Apache-2.0
-- Licensed to the Ed-Fi Alliance under one or more agreements.
-- The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
-- See the LICENSE and NOTICES files in the project root for more information.

SELECT DISTINCT
	studentschoolkey,
	studentkey,
	schoolkey,
	schoolyear,
	studentfirstname,
	studentmiddlename,
	studentlastname,
  enrollmentdatekey,
	gradelevel,
	limitedenglishproficiency,
	ishispanic,
	sex,
  lastmodifieddate
From analytics.StudentSchoolDim
ORDER BY lastmodifieddate
