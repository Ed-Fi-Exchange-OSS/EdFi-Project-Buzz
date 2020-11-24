-- SPDX-License-Identifier: Apache-2.0
-- Licensed to the Ed-Fi Alliance under one or more agreements.
-- The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
-- See the LICENSE and NOTICES files in the project root for more information.

CREATE TABLE buzz.StudentAssessment (
    StudentSchoolKey VARCHAR(45) NOT NULL,
    AssesmentTitle  VARCHAR(100) NOT NULL,
    AssessmentIdentifier VARCHAR(60) NOT NULL,
    DateTaken Date NOT NULL,
    Score varchar(35) NOT NULL,
    CONSTRAINT PK_StudentAssessment PRIMARY KEY (StudentSchoolKey),
    CONSTRAINT FK_StudentAssessment_StudentSchoolKey FOREIGN KEY (StudentSchoolKey) REFERENCES buzz.StudentSchool (StudentSchoolKey)
);
