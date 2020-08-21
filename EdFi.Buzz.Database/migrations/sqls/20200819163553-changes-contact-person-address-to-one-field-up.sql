-- SPDX-License-Identifier: Apache-2.0
-- Licensed to the Ed-Fi Alliance under one or more agreements.
-- The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
-- See the LICENSE and NOTICES files in the project root for more information.

ALTER TABLE buzz.ContactPerson
  DROP COLUMN StreetNumberName,
  DROP COLUMN ApartmentRoomSuiteNumber,
  DROP COLUMN State,
  DROP COLUMN PostalCode;
  
ALTER TABLE buzz.ContactPerson
  ADD COLUMN ContactAddress varchar(303) NULL;
