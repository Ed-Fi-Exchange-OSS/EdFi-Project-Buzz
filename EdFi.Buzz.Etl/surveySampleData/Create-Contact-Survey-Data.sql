-- CREATE A SAMPLE CONTACT SURVEY
CREATE TEMPORARY TABLE IF NOT EXISTS tmp_contact_survey(
"timestamp" VARCHAR(255),
StudentUniqueId VARCHAR(255),
FirstName VARCHAR(255),
LastSurName VARCHAR(255),
"Preferred contact method" VARCHAR(255),
"Best time to contact" VARCHAR(255),
"Contact notes" VARCHAR(255),
PRIMARY KEY (StudentUniqueId)
);

DELETE FROM tmp_contact_survey;

INSERT INTO tmp_contact_survey (StudentUniqueId, FirstName, LastSurname)
SELECT DISTINCT s.studentschoolkey AS "StudentUniqueId", s.studentfirstname AS "FirstName", s.studentlastname AS "LastSurname"
FROM buzz.studentschool s
INNER JOIN buzz.studentsection ss ON s.studentschoolkey = ss.studentschoolkey
INNER JOIN buzz.staffsectionassociation ssa ON ss.sectionkey = ssa.sectionkey
WHERE ssa.staffkey = 1030;

UPDATE tmp_contact_survey
SET
"timestamp" = NOW()
, "Preferred contact method" = CASE floor(RANDOM() * (3-1+1) + 1)::INT WHEN 1 THEN 'SMS' WHEN 2 THEN 'Phone' WHEN 3 THEN 'Email' END
, "Best time to contact" = CASE floor(RANDOM() * (4-1+1) + 1)::INT WHEN 1 THEN 'After work hours' WHEN 2 THEN 'During school hours' WHEN 3 THEN 'After dinner' WHEN 4 THEN 'Weeknights between 6PM and 9PM' WHEN 4 THEN 'Mornings after 9am' END
, "Contact notes" = CASE floor(RANDOM() * (4-1+1) + 1)::INT WHEN 1 THEN 'Speak loudly' WHEN 2 THEN 'Works nights' WHEN 3 THEN 'Actually prefers email sometimes' WHEN 4 THEN 'Phone has issues' WHEN 4 THEN 'Speak slowly' END;

SELECT * FROM tmp_contact_survey ORDER BY 2;
