-- SPDX-License-Identifier: Apache-2.0
-- Licensed to the Ed-Fi Alliance under one or more agreements.
-- The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
-- See the LICENSE and NOTICES files in the project root for more information.

DROP EXTENSION IF EXISTS pgcrypto CASCADE;
CREATE EXTENSION pgcrypto;

ALTER TABLE  buzz.studentassessment
	ADD studentassessmentkey VARCHAR(45) NOT NULL DEFAULT gen_random_uuid ();

ALTER TABLE  buzz.studentassessment
	DROP CONSTRAINT PK_StudentAssessmentKey;

ALTER TABLE  buzz.studentassessment
  ADD CONSTRAINT PK_StudentAssessmentKey
    PRIMARY KEY (studentassessmentkey);

ALTER TABLE  buzz.studentassessment
	ADD CONSTRAINT studentschoolkey_assessmentidentifier_ux UNIQUE (studentschoolkey, assessmentidentifier);

