-- SPDX-License-Identifier: Apache-2.0
-- Licensed to the Ed-Fi Alliance under one or more agreements.
-- The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
-- See the LICENSE and NOTICES files in the project root for more information.

ALTER TABLE buzz.Survey
  ADD COLUMN StaffKey int NOT NULL;
ALTER TABLE buzz.Survey ADD CONSTRAINT FK_Survey_StaffKey_StaffKey FOREIGN KEY (StaffKey) REFERENCES buzz.Staff (StaffKey);
