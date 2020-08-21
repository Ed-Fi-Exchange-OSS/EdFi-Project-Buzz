-- CREATE A SAMPLE INTERNET ACCESS SURVEY
CREATE TEMPORARY TABLE IF NOT EXISTS tmp_internet_survey(
"timestamp" VARCHAR(255),
StudentUniqueId VARCHAR(255),
FirstName VARCHAR(255),
LastSurName VARCHAR(255),
"Internet Access Type" VARCHAR(255),
"Has School Email Account" VARCHAR(255),
"Has School Student Account" VARCHAR(255),
PRIMARY KEY (StudentUniqueId)
);

DELETE FROM tmp_internet_survey;

INSERT INTO tmp_internet_survey (StudentUniqueId, FirstName, LastSurname) 
SELECT DISTINCT s.studentkey AS "StudentUniqueId", s.studentfirstname AS "FirstName", s.studentlastname AS "LastSurname"
FROM buzz.studentschool s
INNER JOIN buzz.studentsection ss ON s.studentschoolkey = ss.studentschoolkey
INNER JOIN buzz.staffsectionassociation ssa ON ss.sectionkey = ssa.sectionkey
WHERE
ssa.staffkey = 1030;

UPDATE tmp_internet_survey 
SET 
"timestamp" = NOW(), 
"Internet Access Type" = CASE floor(RANDOM() * (3-1+1) + 1)::INT WHEN 1 THEN 'High Speed Internet' WHEN 2 THEN 'School provided hot-spot' WHEN 3 THEN 'No Internet' END
, "Has School Email Account" = CASE floor(RANDOM() * (2-1+1) + 1)::INT WHEN 1 THEN 'Yes' WHEN 2 THEN 'No' END
, "Has School Student Account" = CASE floor(RANDOM() * (2-1+1) + 1)::INT WHEN 1 THEN 'Yes' WHEN 2 THEN 'No' END;

SELECT "timestamp" AS "Timestamp" , studentuniqueid AS "StudentUniqueId" , firstname AS "FirstName", lastsurname AS "LastSurname", "Internet Access Type" AS "Internet Access Type", "Has School Email Account" AS "Has School Email Account", "Has School Student Account" AS "Has School Student Account"
FROM tmp_internet_survey ORDER BY 2;