SELECT DISTINCT
    p.parentuniqueid as contactkey,
    seoa.id as studentschoolkey
From edfi.Student s
	-- Demogs reported at the district level
	INNER JOIN edfi.StudentEducationOrganizationAssociation seoa on s.StudentUSI = seoa.StudentUSI
    -- Contact Info
    INNER JOIN edfi.StudentParentAssociation spa ON s.StudentUSI = spa.StudentUSI
    INNER JOIN edfi.Parent p ON spa.ParentUSI = p.ParentUSI
WHERE p.parentuniqueid IS NOT NULL AND seoa.id IS NOT NULL;


