-- SPDX-License-Identifier: Apache-2.0
-- Licensed to the Ed-Fi Alliance under one or more agreements.
-- The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
-- See the LICENSE and NOTICES files in the project root for more information.

CREATE TABLE buzz.DemographicsType (
    DemographicsTypeKey INT NOT NULL GENERATED ALWAYS AS IDENTITY,
    Type VARCHAR(100) NOT NULL,
    CONSTRAINT PK_DemographicsTypeKey PRIMARY KEY (DemographicsTypeKey)
);

INSERT INTO buzz.DemographicsType (Type)
VALUES ('Characteristics'), 
        ('Programs');

CREATE TABLE buzz.Demographics (
    DemographicsKey INT NOT NULL GENERATED ALWAYS AS IDENTITY,
    ShortDescription VARCHAR(75) NOT NULL,
    DemographicsTypeKey INT NOT NULL,
    CONSTRAINT PK_DemographicsKey PRIMARY KEY (DemographicsKey),
    CONSTRAINT FK_Demographics_DemographicsTypeKey FOREIGN KEY (DemographicsTypeKey) REFERENCES buzz.DemographicsType (DemographicsTypeKey)
);

CREATE TABLE buzz.StudentDemographics (
    DemographicsKey INT NOT NULL,
    StudentSchoolKey VARCHAR(45) NOT NULL,
    CONSTRAINT PK_StudentDemographicsKey PRIMARY KEY (DemographicsKey,StudentSchoolKey),
    CONSTRAINT FK_StudentDemographics_DemographicsKey FOREIGN KEY (DemographicsKey) REFERENCES buzz.Demographics (DemographicsKey),
    CONSTRAINT FK_StudentDemographics_StudentSchoolKey FOREIGN KEY (StudentSchoolKey) REFERENCES buzz.StudentSchool (StudentSchoolKey)
);
