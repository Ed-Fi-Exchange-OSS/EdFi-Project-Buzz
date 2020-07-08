     SELECT
            CAST(Student.StudentUniqueId AS NVARCHAR) + '-' + CAST(StudentSectionAssociation.SchoolId AS NVARCHAR) + '-' + StudentSectionAssociation.LocalCourseCode + '-' + CAST(StudentSectionAssociation.SchoolYear AS NVARCHAR) + '-' + StudentSectionAssociation.SectionIdentifier + '-' + StudentSectionAssociation.SessionName + '-' + CONVERT(NVARCHAR, StudentSectionAssociation.BeginDate, 112) AS studentsectionkey,
			CONCAT(Student.StudentUniqueId ,'-', CAST(StudentSectionAssociation.SchoolId AS VARCHAR)) as studentschoolkey,
            Student.StudentUniqueId AS studentkey,
            CAST(StudentSectionAssociation.SchoolId AS NVARCHAR) + '-' + StudentSectionAssociation.LocalCourseCode + '-' + CAST(StudentSectionAssociation.SchoolYear AS NVARCHAR) + '-' + StudentSectionAssociation.SectionIdentifier + '-' + StudentSectionAssociation.SessionName AS sectionkey,
            StudentSectionAssociation.localcoursecode,
            ISNULL(AcademicSubjectType.CodeValue, '') AS subject,
            ISNULL(Course.CourseTitle, '') AS coursetitle,

            -- There could be multiple teachers for a section - reduce those to a single string.
            -- Unfortunately this means that the Staff and StaffSectionAssociation
            -- LastModifiedDate values can't be used to calculate this record's LastModifiedDate
            ISNULL(STUFF(
     (
         SELECT
                N', ' + ISNULL(Staff.FirstName, '') + ' ' + ISNULL(Staff.LastSurname, '')
         FROM edfi.StaffSectionAssociation
              LEFT OUTER JOIN edfi.Staff
              ON StaffSectionAssociation.StaffUSI = Staff.StaffUSI
         WHERE StudentSectionAssociation.SchoolId = StaffSectionAssociation.SchoolId
               AND StudentSectionAssociation.LocalCourseCode = StaffSectionAssociation.LocalCourseCode
               AND StudentSectionAssociation.SchoolYear = StaffSectionAssociation.SchoolYear
               AND StudentSectionAssociation.SectionIdentifier = StaffSectionAssociation.SectionIdentifier
               AND StudentSectionAssociation.SessionName = StaffSectionAssociation.SessionName FOR
         XML PATH('')
     ), 1, 1, N''), '') AS teachername,
            CONVERT(NVARCHAR, StudentSectionAssociation.BeginDate, 112) AS studentsectionstartdatekey,
            CONVERT(NVARCHAR, StudentSectionAssociation.EndDate, 112) AS studentsectionenddatekey,
            CAST(StudentSectionAssociation.SchoolId AS VARCHAR) AS schoolkey,
            CAST(StudentSectionAssociation.SchoolYear AS NVARCHAR) AS schoolyear,
     (
         SELECT
                MAX(MaxLastModifiedDate)
         FROM(VALUES(StudentSectionAssociation.LastModifiedDate), (Course.LastModifiedDate), (CourseOffering.LastModifiedDate), (AcademicSubjectType.LastModifiedDate)) AS VALUE(MaxLastModifiedDate)
     ) AS lastmodifieddate
     FROM edfi.StudentSectionAssociation
          INNER JOIN edfi.Student
          ON StudentSectionAssociation.StudentUSI = Student.StudentUSI
          INNER JOIN edfi.CourseOffering
          ON CourseOffering.SchoolId = StudentSectionAssociation.SchoolId
             AND CourseOffering.LocalCourseCode = StudentSectionAssociation.LocalCourseCode
             AND CourseOffering.SchoolYear = StudentSectionAssociation.SchoolYear
             AND CourseOffering.SessionName = StudentSectionAssociation.SessionName
          INNER JOIN edfi.Course
          ON Course.CourseCode = CourseOffering.CourseCode
             AND Course.EducationOrganizationId = CourseOffering.EducationOrganizationId
          LEFT OUTER JOIN edfi.AcademicSubjectDescriptor
          ON AcademicSubjectDescriptor.AcademicSubjectDescriptorId = Course.AcademicSubjectDescriptorId
          LEFT OUTER JOIN edfi.Descriptor AS AcademicSubjectType
          ON AcademicSubjectType.DescriptorId = AcademicSubjectDescriptor.AcademicSubjectDescriptorId
    ORDER BY 13;
