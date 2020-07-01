SELECT DISTINCT
 ssd.studentsectionkey,
 CONCAT(ssd.StudentKey, '-', ssd.SchoolKey) as studentschoolkey,
 ssd.studentkey,
 ssd.sectionkey,
 ssd.localcoursecode,
 ssd.subject,
 ssd.coursetitle,
 ssd.teachername,
 ssd.studentsectionstartdatekey,
 ssd.studentsectionenddatekey,
 ssd.schoolkey,
 ssd.schoolyear
FROM analytics.StudentSectionDim ssd
INNER JOIN analytics.StudentSchoolDim sd ON ssd.StudentKey = sd.StudentKey;
