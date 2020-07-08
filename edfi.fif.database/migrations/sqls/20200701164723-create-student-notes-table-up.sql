-- SPDX-License-Identifier: Apache-2.0
-- Licensed to the Ed-Fi Alliance under one or more agreements.
-- The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
-- See the LICENSE and NOTICES files in the project root for more information.

CREATE TABLE fif.StudentNote (
    StudentNoteKey INT NOT NULL GENERATED ALWAYS AS IDENTITY,
    Note varchar(512) NOT NULL,
    StudentSchoolKey varchar(45) NOT NULL,
    CONSTRAINT PK_StudentNotes_StudentNoteKey PRIMARY KEY (StudentNoteKey),
    CONSTRAINT FK_StudentNotes_StudentSchoolKey_StudentSchoolKey FOREIGN KEY (StudentSchoolKey) REFERENCES fif.StudentSchool (StudentSchoolKey)
);
