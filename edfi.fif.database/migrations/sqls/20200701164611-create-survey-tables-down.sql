-- SPDX-License-Identifier: Apache-2.0
-- Licensed to the Ed-Fi Alliance under one or more agreements.
-- The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
-- See the LICENSE and NOTICES files in the project root for more information.

DROP TABLE fif.StudentSurveyAnswer;
DROP TABLE fif.StudentSurvey;
DROP TABLE fif.SurveyQuestion;
DROP TABLE fif.Survey;

CREATE TABLE fif.Survey (
    SurveyKey varchar(128) NOT NULL,
    Title varchar(128) NOT NULL,
    Info json NOT NULL,
    CONSTRAINT PK_SurveySurveyKey PRIMARY KEY (SurveyKey)
);
