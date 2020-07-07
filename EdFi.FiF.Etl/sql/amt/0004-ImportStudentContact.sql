SELECT DISTINCT
  cpd.uniquekey as contactkey,
  seoa.studentSchoolKey as studentschoolkey
From analytics.ContactPersonDim cpd
INNER JOIN analytics.StudentSchoolDim seoa on cpd.Studentkey = seoa.StudentKey
