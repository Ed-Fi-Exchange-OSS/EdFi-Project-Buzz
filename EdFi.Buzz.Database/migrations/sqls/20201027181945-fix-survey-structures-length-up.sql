-- SPDX-License-Identifier: Apache-2.0
-- Licensed to the Ed-Fi Alliance under one or more agreements.
-- The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
-- See the LICENSE and NOTICES files in the project root for more information.

DROP VIEW buzz.SurveySummaryAnswers;
DROP VIEW buzz.SurveySummaryQuestions;
DROP VIEW buzz.SurveySummary;
DROP VIEW buzz.AnswersByStudent;

ALTER TABLE buzz.SurveyQuestion
  ALTER Question TYPE varchar(1024);

ALTER TABLE buzz.StudentSurveyAnswer
  ALTER Answer TYPE varchar(2048);

ALTER TABLE buzz.Survey
  ALTER Title TYPE varchar(256);

---

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

---

CREATE OR REPLACE VIEW buzz.SurveySummary
AS

SELECT
  buzz.staffsectionassociation.staffkey,
  buzz.studentsection.sectionkey,
  buzz.survey.surveykey,
  buzz.survey.title,
  COUNT(buzz.studentsurvey.studentschoolkey) AS studentsanswered,
  (
    SELECT
      COUNT(buzz.surveyquestion.surveyquestionkey)
    FROM
      buzz.surveyquestion
    WHERE
      buzz.surveyquestion.surveykey = buzz.survey.surveykey
    GROUP BY
      buzz.surveyquestion.surveykey
  ) AS numberofquestions,
  (
    SELECT
      COUNT(studsection.studentschoolkey)
    FROM
      buzz.studentsection studsection
    WHERE
      studsection.sectionkey = buzz.studentsection.sectionkey
  ) AS totalstudents
FROM
  buzz.survey
    INNER JOIN
      buzz.studentsurvey
        ON survey.surveykey = buzz.studentsurvey.surveykey
    INNER JOIN
      buzz.studentsection
        ON buzz.studentsurvey.studentschoolkey = buzz.studentsection.studentschoolkey
    INNER JOIN
      buzz.staffsectionassociation
        ON buzz.studentsection.sectionkey = buzz.staffsectionassociation.sectionkey
WHERE buzz.survey.deletedat IS NULL
GROUP BY buzz.staffsectionassociation.staffkey, buzz.studentsection.sectionkey, survey.surveykey, survey.title;

---

CREATE OR REPLACE VIEW buzz.SurveySummaryQuestions
AS

  SELECT
    survey.surveykey,
    survey.title,
    surveyquestion.surveyquestionkey,
    surveyquestion.question
  FROM
    buzz.survey
      INNER JOIN
        buzz.surveyquestion
          ON survey.surveykey = surveyquestion.surveykey;

--

CREATE OR REPLACE VIEW buzz.SurveySummaryAnswers
AS

SELECT
  buzz.studentsection.sectionkey,
  survey.surveykey,
  survey.title,
  surveyquestion.surveyquestionkey,
  surveyquestion.question,
  studentschool.studentschoolkey,
  CONCAT(studentschool.studentlastname, ' ', studentschool.studentfirstname, RTRIM(' ' || studentschool.studentmiddlename) ) AS studentname,
  studentsurveyanswer.answer
FROM
  buzz.survey
    INNER JOIN
      buzz.surveyquestion
        ON survey.surveykey = surveyquestion.surveykey
    INNER JOIN
      buzz.studentsurvey
        ON survey.surveykey = studentsurvey.surveykey
    INNER JOIN
      buzz.studentschool
        ON studentsurvey.studentschoolkey = studentschool.studentschoolkey
    INNER JOIN
      buzz.studentsection
        ON buzz.studentschool.studentschoolkey = studentsection.studentschoolkey
    INNER JOIN
      buzz.studentsurveyanswer
        ON studentsurvey.studentsurveykey = studentsurveyanswer.studentsurveykey AND surveyquestion.surveyquestionkey = studentsurveyanswer.surveyquestionkey
WHERE buzz.survey.deletedat IS NULL;