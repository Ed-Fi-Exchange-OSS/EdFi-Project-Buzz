SELECT DISTINCT
	CONCAT(s.StudentUniqueId, '-', ssa.SchoolId) AS StudentSchoolKey,
	s.StudentUniqueId as studentkey,
	ssa.SchoolId as schoolkey,
	ssa.schoolyear as schoolyear,
	s.firstname as studentfirstname,
	s.middlename as studentmiddlename,
	s.lastsurname as studentlastname,
	ssa.entrydate as enrollmentdatekey,
	gld.codevalue as gradelevel,
	lep.codevalue as limitedenglishproficiency,
	seoa.hispaniclatinoethnicity as ishispanic,
	sd.codevalue as sex
From edfi.Student s
	-- Demogs reported at the district level
	INNER JOIN edfi.StudentEducationOrganizationAssociation seoa on s.StudentUSI = seoa.StudentUSI
	INNER JOIN edfi.EducationOrganization eo on seoa.EducationOrganizationId = eo.EducationOrganizationId
	INNER JOIN edfi.Descriptor sd on seoa.SexDescriptorId = sd.DescriptorId
	LEFT JOIN edfi.Descriptor lep on seoa.LimitedEnglishProficiencyDescriptorId = lep.DescriptorId
	-- Enrollment
	INNER JOIN edfi.StudentSchoolAssociation ssa on s.StudentUSI = ssa.StudentUSI
	INNER JOIN edfi.EducationOrganization so on ssa.SchoolId = so.EducationOrganizationId
	INNER JOIN edfi.Descriptor gld on ssa.EntryGradeLevelDescriptorId = gld.DescriptorId;
