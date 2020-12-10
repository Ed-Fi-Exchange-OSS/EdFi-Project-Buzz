-- SPDX-License-Identifier: Apache-2.0
-- Licensed to the Ed-Fi Alliance under one or more agreements.
-- The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
-- See the LICENSE and NOTICES files in the project root for more information.

-- STUDENT ATTENDANCE

WITH source AS (VALUES
  ('100001-100001', 98.10, 1.90, 94.50, 5.50, 96.30, 3.70),
  ('100002-100001', 92.60, 7.40, 95.00, 5.00, 96.60, 3.40),
  ('100003-100001', 93.90, 6.10, 94.20, 5.80, 96.70, 3.30),
  ('100004-100001', 91.90, 8.10, 99.80, 1.20, 98.40, 1.60),
  ('100005-100001', 92.20, 7.80, 89.90, 10.10, 97.50, 2.50),
  ('100006-100001', 90.90, 9.10, 91.40, 8.60, 97.70, 2.30),
  ('100007-100001', 97.40, 2.60, 98.10, 1.90, 90.00, 10.00),
  ('100008-100001', 99.90, 0.01, 98.90, 1.10, 99.60, 1.40)
)
INSERT INTO 
  buzz.attendance
(
  StudentSchoolKey,
  ReportedAsPresentAtSchool,
  ReportedAsAbsentFromSchool,
  ReportedAsPresentAtHomeRoom,
  ReportedAsAbsentFromHomeRoom,
  ReportedAsIsPresentInAllSections,
  ReportedAsAbsentFromAnySection
)
SELECT
  source.column1,
  source.column2,
  source.column3,
  source.column4,
  source.column5,
  source.column6,
  source.column7
FROM
  source
ON CONFLICT DO NOTHING;