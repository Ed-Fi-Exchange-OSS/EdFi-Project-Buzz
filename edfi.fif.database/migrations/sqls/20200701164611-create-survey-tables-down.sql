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
