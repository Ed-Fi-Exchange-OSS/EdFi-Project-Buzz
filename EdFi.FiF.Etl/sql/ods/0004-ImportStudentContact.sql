SELECT DISTINCT
    p.parentuniqueid as contactkey,
    CONCAT(s.StudentUniqueId, '-', ssa.SchoolId) AS StudentSchoolKey
From edfi.Student s
	-- Demogs reported at the district level
	INNER JOIN edfi.StudentSchoolAssociation ssa on s.StudentUSI = ssa.StudentUSI
	INNER JOIN edfi.StudentEducationOrganizationAssociation seoa on s.StudentUSI = seoa.StudentUSI
    -- Contact Info
    INNER JOIN edfi.StudentParentAssociation spa ON s.StudentUSI = spa.StudentUSI
    INNER JOIN edfi.Parent p ON spa.ParentUSI = p.ParentUSI
WHERE p.parentuniqueid IS NOT NULL AND seoa.id IS NOT NULL;
