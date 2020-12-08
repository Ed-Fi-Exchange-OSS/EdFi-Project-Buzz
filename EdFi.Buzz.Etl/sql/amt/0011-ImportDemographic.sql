-- SPDX-License-Identifier: Apache-2.0
-- Licensed to the Ed-Fi Alliance under one or more agreements.
-- The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
-- See the LICENSE and NOTICES files in the project root for more information.

SELECT
       DemographicLabel AS shortdescription,
       1 AS demographicstypekey
FROM
     analytics.DemographicDim
WHERE DemographicParentKey IN('StudentCharacteristic')
UNION ALL
SELECT DISTINCT
       ProgramName AS shortdescription,
       2 AS demographicstypekey
FROM
     edfi.Program;
