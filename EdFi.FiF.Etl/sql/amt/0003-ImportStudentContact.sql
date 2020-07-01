SELECT DISTINCT
  cpd.uniquekey as contactkey,
  seoa.studentlocaleducationagencykey as studentschoolkey
From analytics.ContactPersonDim cpd
INNER JOIN analytics.StudentLocalEducationAgencyDim seoa on cpd.Studentkey = seoa.StudentKey
