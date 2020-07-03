CREATE OR REPLACE VIEW fif.AnswersByStudent
AS
  
  SELECT
    surveyquestion.surveykey,
    surveyquestion.surveyquestionkey,
    surveyquestion.question,
    studentschool.studentschoolkey,
    studentsurveyanswer.answer
  FROM
    fif.surveyquestion 
      INNER JOIN
        fif.studentsurvey 
          ON fif.surveyquestion.surveykey = studentsurvey.surveykey
      INNER JOIN
        fif.studentschool 
          ON studentsurvey.studentschoolkey = studentschool.studentschoolkey
      INNER JOIN
        fif.studentsurveyanswer 
          ON studentsurvey.studentsurveykey = studentsurveyanswer.studentsurveykey AND surveyquestion.surveyquestionkey = studentsurveyanswer.surveyquestionkey;
