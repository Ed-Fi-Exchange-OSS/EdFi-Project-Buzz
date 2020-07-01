SELECT DISTINCT
	studentschoolkey,
	studentkey,
	schoolkey,
	schoolyear,
	studentfirstname,
	studentmiddlename,
	studentlastname,
  enrollmentdatekey,
	gradelevel,
	limitedenglishproficiency,
	ishispanic,
	sex,
  lastmodifieddate
From analytics.StudentSchoolDim
ORDER BY lastmodifieddate
