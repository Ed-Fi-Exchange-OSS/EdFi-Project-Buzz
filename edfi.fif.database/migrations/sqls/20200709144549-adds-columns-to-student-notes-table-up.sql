-- SPDX-License-Identifier: Apache-2.0
-- Licensed to the Ed-Fi Alliance under one or more agreements.
-- The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
-- See the LICENSE and NOTICES files in the project root for more information.

ALTER TABLE fif.StudentNote
  ADD COLUMN StaffKey INT NOT NULL,
  ADD COLUMN DateAdded DATE NOT NULL,
  ADD CONSTRAINT FK_StudentNotes_StaffKey_StaffKey FOREIGN KEY (StaffKey) REFERENCES fif.Staff (StaffKey);
