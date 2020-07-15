-- SPDX-License-Identifier: Apache-2.0
-- Licensed to the Ed-Fi Alliance under one or more agreements.
-- The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
-- See the LICENSE and NOTICES files in the project root for more information.

SELECT DISTINCT
    s.staffusi as staffkey,
    s.personaltitleprefix as personaltitleprefix,
    s.firstname as firstname,
    s.middlename as middlename,
    s.lastsurname as lastsurname,
    s.staffuniqueid as staffuniqueid,
    (SELECT TOP 1 m.ElectronicMailAddress
      FROM edfi.StaffElectronicMail m
      WHERE m.staffusi = s.staffusi) as electronicmailaddress
FROM edfi.Staff s
