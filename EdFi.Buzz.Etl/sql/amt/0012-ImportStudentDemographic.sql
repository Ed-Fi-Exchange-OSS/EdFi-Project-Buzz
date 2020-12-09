-- SPDX-License-Identifier: Apache-2.0
-- Licensed to the Ed-Fi Alliance under one or more agreements.
-- The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
-- See the LICENSE and NOTICES files in the project root for more information.
SELECT
       StudentSchoolDemographicsBridge.StudentSchoolKey AS studentschoolkey,
       DemographicDim.DemographicLabel AS shortdescription,
       1 AS demographicstypekey
FROM
     analytics.StudentSchoolDemographicsBridge
INNER JOIN
    analytics.DemographicDim ON
        StudentSchoolDemographicsBridge.DemographicKey = DemographicDim.DemographicKey
WHERE DemographicParentKey IN('StudentCharacteristic')
UNION ALL
SELECT distinct
       StudentSchoolKey AS studentschoolkey,
       ProgramName AS shortdescription,
       2 AS demographicstypekey
FROM
     edfi.StudentProgramAssociation spa
INNER JOIN
    edfi.Student s ON
        spa.StudentUSI = s.StudentUSI
INNER JOIN
    analytics.StudentSchoolDim ss ON
        ss.StudentKey = s.StudentUniqueId;
