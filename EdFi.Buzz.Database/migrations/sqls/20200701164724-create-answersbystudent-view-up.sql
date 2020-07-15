-- SPDX-License-Identifier: Apache-2.0
-- Licensed to the Ed-Fi Alliance under one or more agreements.
-- The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
-- See the LICENSE and NOTICES files in the project root for more information.

CREATE OR REPLACE VIEW buzz.AnswersByStudent
AS
  
  SELECT
    surveyquestion.surveykey,
    surveyquestion.surveyquestionkey,
    surveyquestion.question,
    studentschool.studentschoolkey,
    studentsurveyanswer.answer
  FROM
    buzz.surveyquestion 
      INNER JOIN
        buzz.studentsurvey 
          ON buzz.surveyquestion.surveykey = studentsurvey.surveykey
      INNER JOIN
        buzz.studentschool 
          ON studentsurvey.studentschoolkey = studentschool.studentschoolkey
      INNER JOIN
        buzz.studentsurveyanswer 
          ON studentsurvey.studentsurveykey = studentsurveyanswer.studentsurveykey AND surveyquestion.surveyquestionkey = studentsurveyanswer.surveyquestionkey;
