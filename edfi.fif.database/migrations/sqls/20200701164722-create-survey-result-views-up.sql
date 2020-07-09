-- SPDX-License-Identifier: Apache-2.0
-- Licensed to the Ed-Fi Alliance under one or more agreements.
-- The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
-- See the LICENSE and NOTICES files in the project root for more information.

CREATE OR REPLACE VIEW fif.SurveySummary
AS

SELECT
  fif.staffsectionassociation.staffkey,
  fif.studentsection.sectionkey,
  fif.survey.surveykey,
  fif.survey.title,
  COUNT(fif.studentsurvey.studentschoolkey) AS studentsanswered,
  (
    SELECT
      COUNT(fif.surveyquestion.surveyquestionkey)
    FROM
      fif.surveyquestion
    WHERE
      fif.surveyquestion.surveykey = fif.survey.surveykey
    GROUP BY
      fif.surveyquestion.surveykey
  ) AS numberofquestions,
  (
    SELECT
      COUNT(studsection.studentschoolkey)
    FROM
      fif.studentsection studsection
    WHERE
      studsection.sectionkey = fif.studentsection.sectionkey
  ) AS totalstudents
FROM
  fif.survey
    INNER JOIN
      fif.studentsurvey
        ON survey.surveykey = fif.studentsurvey.surveykey
    INNER JOIN
      fif.studentsection
        ON fif.studentsurvey.studentschoolkey = fif.studentsection.studentschoolkey
    INNER JOIN
      fif.staffsectionassociation
        ON fif.studentsection.sectionkey = fif.staffsectionassociation.sectionkey
GROUP BY fif.staffsectionassociation.staffkey, fif.studentsection.sectionkey, survey.surveykey, survey.title;

---

CREATE OR REPLACE VIEW fif.SurveySummaryQuestions
AS

  SELECT
    survey.surveykey,
    survey.title,
    surveyquestion.surveyquestionkey,
    surveyquestion.question
  FROM
    fif.survey
      INNER JOIN
        fif.surveyquestion
          ON survey.surveykey = surveyquestion.surveykey;

---

CREATE OR REPLACE VIEW fif.SurveySummaryAnswers
AS

  SELECT
    fif.studentsection.sectionkey,
    survey.surveykey,
    survey.title,
    surveyquestion.surveyquestionkey,
    surveyquestion.question,
    studentschool.studentschoolkey,
    CONCAT(studentschool.studentlastname, ' ', studentschool.studentfirstname, RTRIM(' ' || studentschool.studentmiddlename) ) AS studentname,
    studentsurveyanswer.answer
  FROM
    fif.survey
      INNER JOIN
        fif.surveyquestion
          ON survey.surveykey = surveyquestion.surveykey
      INNER JOIN
        fif.studentsurvey
          ON survey.surveykey = studentsurvey.surveykey
      INNER JOIN
        fif.studentschool
          ON studentsurvey.studentschoolkey = studentschool.studentschoolkey
      INNER JOIN
        fif.studentsection
          ON fif.studentschool.studentschoolkey = studentsection.studentschoolkey
      INNER JOIN
        fif.studentsurveyanswer
          ON studentsurvey.studentsurveykey = studentsurveyanswer.studentsurveykey AND surveyquestion.surveyquestionkey = studentsurveyanswer.surveyquestionkey;
