-- SPDX-License-Identifier: Apache-2.0
-- Licensed to the Ed-Fi Alliance under one or more agreements.
-- The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
-- See the LICENSE and NOTICES files in the project root for more information.

CREATE TABLE buzz.JobStatus (
    JobStatusKey INT NOT NULL,
    Description varchar(128) NOT NULL,
    CONSTRAINT PK_JobStatusKey PRIMARY KEY (JobStatusKey)
);

CREATE TABLE buzz.SurveyStatus (
    SurveyStatusKey INT NOT NULL GENERATED ALWAYS AS IDENTITY,
    StaffKey INT NOT NULL,
    SurveyKey INT NULL,
    JobKey TEXT NOT NULL,
    JobStatusKey INT NOT NULL,
    ResultSummary varchar(4000) NULL,
    CONSTRAINT PK_SurveyStatus PRIMARY KEY (SurveyStatusKey),
    CONSTRAINT FK_SurveyQuestion_SurveyStatusKey_JobStatusKey FOREIGN KEY (JobStatusKey) REFERENCES buzz.JobStatus (JobStatusKey)
);

INSERT INTO buzz.jobstatus (jobstatuskey, description)
  VALUES (1, 'Queued');
INSERT INTO buzz.jobstatus (jobstatuskey, description)
  VALUES (2, 'Processing');
INSERT INTO buzz.jobstatus (jobstatuskey, description)
	VALUES (3, 'Completed');
