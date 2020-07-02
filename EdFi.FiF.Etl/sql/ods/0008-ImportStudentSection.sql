SELECT DISTINCT
	ssa.id as studentsectionkey,
	ssa.studentusi as studentschoolkey,
	ssa.studentusi as studentkey,
	ssa.sectionidentifier as sectionkey,
	ssa.localcoursecode as localcoursecode,
	cd.codevalue as 'subject',
	c.coursetitle as coursetitle,
		ISNULL(STUFF(
		(
			SELECT
				N', ' + ISNULL(Staff.FirstName, '') + ' ' + ISNULL(Staff.LastSurname, '')
			FROM edfi.StaffSectionAssociation
				LEFT OUTER JOIN edfi.Staff
				ON StaffSectionAssociation.StaffUSI = Staff.StaffUSI
			WHERE ssa.SchoolId = StaffSectionAssociation.SchoolId
				AND ssa.LocalCourseCode = StaffSectionAssociation.LocalCourseCode
				AND ssa.SchoolYear = StaffSectionAssociation.SchoolYear
				AND ssa.SectionIdentifier = StaffSectionAssociation.SectionIdentifier
				AND ssa.SessionName = StaffSectionAssociation.SessionName FOR
			XML PATH('')
		), 1, 1, N''), '') AS TeacherName,
	ssa.begindate as studentsectionstartdatekey,
	ssa.enddate as studentsectionenddatekey,
	sec.schoolid as schoolkey,
	ssa.schoolyear as schoolyear
FROM edfi.StudentSectionAssociation ssa
	INNER JOIN edfi.Section sec ON ssa.SectionIdentifier = sec.SectionIdentifier
	INNER JOIN edfi.StaffSectionAssociation stsa on sec.SectionIdentifier = stsa.SectionIdentifier
	INNER JOIN edfi.Course c ON c.CourseCode = sec.LocalCourseCode
	INNER JOIN edfi.Descriptor cd ON c.AcademicSubjectDescriptorId = cd.DescriptorId
