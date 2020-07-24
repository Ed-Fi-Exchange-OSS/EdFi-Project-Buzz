-- CREATE A SAMPLE INTERNET ACCESS SURVEY
SELECT DISTINCT NOW() AS "Timestamp", s.studentkey AS "StudentUniqueId", s.studentfirstname AS "FirstName", s.studentlastname AS "LastSurname", 'Phone' AS "Preferred contact method", 'After 6pm' AS "Best time to contact", 'Speak loud' AS "Contact notes"
FROM buzz.studentschool s
INNER JOIN buzz.studentsection ss ON s.studentschoolkey = ss.studentschoolkey
INNER JOIN buzz.staffsectionassociation ssa ON ss.sectionkey = ssa.sectionkey
WHERE
ssa.staffkey = 1030
