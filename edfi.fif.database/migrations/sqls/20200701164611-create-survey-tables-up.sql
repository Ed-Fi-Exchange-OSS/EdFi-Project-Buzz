-- SPDX-License-Identifier: Apache-2.0
-- Licensed to the Ed-Fi Alliance under one or more agreements.
-- The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
-- See the LICENSE and NOTICES files in the project root for more information.

DROP TABLE fif.Survey;

CREATE TABLE fif.Survey (
    SurveyKey INT NOT NULL GENERATED ALWAYS AS IDENTITY,
    Title varchar(128) NOT NULL,
    CONSTRAINT PK_SurveySurveyKey PRIMARY KEY (SurveyKey)
);

CREATE TABLE fif.SurveyQuestion (
    SurveyQuestionKey INT NOT NULL GENERATED ALWAYS AS IDENTITY,
    SurveyKey INT NOT NULL,
    Question VARCHAR(256) NOT NULL,
    CONSTRAINT PK_SurveyQuestionSurveyQuestionKey PRIMARY KEY (SurveyQuestionKey),
    CONSTRAINT FK_SurveyQuestion_SurveyQuestion_SurveyKey FOREIGN KEY (SurveyKey) REFERENCES fif.Survey (SurveyKey)
);

CREATE TABLE fif.StudentSurvey (
    StudentSurveyKey INT NOT NULL GENERATED ALWAYS AS IDENTITY,
    SurveyKey INT NOT NULL,
    StudentSchoolKey varchar(45) NOT NULL,
    Date Date NOT NULL,
    CONSTRAINT PK_StudentSurveyStudentSurveyKey PRIMARY KEY (StudentSurveyKey),
    CONSTRAINT FK_StudentSurvey_StudentSurvey_SurveyKey FOREIGN KEY (SurveyKey) REFERENCES fif.Survey (SurveyKey),
    CONSTRAINT FK_StudentSchool_StudentSchool_StudentSchoolKey FOREIGN KEY (StudentSchoolKey) REFERENCES fif.StudentSchool (StudentSchoolKey)
);

CREATE TABLE fif.StudentSurveyAnswer (
    StudentSurveyAnswerKey INT NOT NULL GENERATED ALWAYS AS IDENTITY,
    StudentSurveyKey INT NOT NULL,
    SurveyQuestionKey INT NOT NULL,
    Answer VARCHAR(256) NOT NULL,
    CONSTRAINT PK_StudentSurveyAnswerStudentSurveyAnswerKey PRIMARY KEY (StudentSurveyAnswerKey),
    CONSTRAINT FK_StudentSurveyAnswer_StudentSurveyAnswerKey_StudentSurveyKey FOREIGN KEY (StudentSurveyKey) REFERENCES fif.StudentSurvey (StudentSurveyKey),
    CONSTRAINT FK_StudentSurveyAnswer_StudentSurveyAnswerKey_SurveyQuestionKey FOREIGN KEY (SurveyQuestionKey) REFERENCES fif.SurveyQuestion (SurveyQuestionKey)
);
