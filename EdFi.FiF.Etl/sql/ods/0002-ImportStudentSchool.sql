    SELECT
        CONCAT(Student.StudentUniqueId, '-', StudentSchoolAssociation.SchoolId) AS studentschoolkey,
        Student.StudentUniqueId AS studentkey,
        CAST(StudentSchoolAssociation.SchoolId AS VARCHAR) AS schoolkey,
        COALESCE(CAST(StudentSchoolAssociation.SchoolYear AS VARCHAR), 'Unknown') AS SchoolYear,
        Student.FirstName AS studentfirstname,
        COALESCE(Student.MiddleName, '') AS studentmiddlename,
        COALESCE(Student.LastSurname, '') AS studentlastname,
        CAST(StudentSchoolAssociation.EntryDate AS NVARCHAR) AS enrollmentdatekey,
        Descriptor.CodeValue AS gradelevel,
        COALESCE(CASE
                    WHEN schoolEdOrg.StudentUSI IS NOT NULL
                    THEN LimitedEnglishDescriptorSchool.CodeValue
                    ELSE LimitedEnglishDescriptorDist.CodeValue
                END, 'Not applicable') AS limitedenglishproficiency,
        COALESCE(CASE
                    WHEN schoolEdOrg.StudentUSI IS NOT NULL
                    THEN schoolEdOrg.HispanicLatinoEthnicity
                    ELSE districtEdOrg.HispanicLatinoEthnicity
                END, CAST(0 as BIT)) AS ishispanic,
        COALESCE(CASE
                    WHEN schoolEdOrg.StudentUSI IS NOT NULL
                    THEN SexTypeSchool.CodeValue
                    ELSE SexTypeDist.CodeValue
                END, 'Unknown') AS sex,
        (
            SELECT
                MAX(COALESCE(MaxLastModifiedDate, GETDATE()))
            FROM (VALUES
                (Student.LastModifiedDate)
                ,(schoolEdOrg.LastModifiedDate)
                ,(districtEdOrg.LastModifiedDate)
            ) AS VALUE(MaxLastModifiedDate)
        ) AS lastmodifieddate
    FROM
        edfi.Student
    INNER JOIN
        edfi.StudentSchoolAssociation ON
            Student.StudentUSI = StudentSchoolAssociation.StudentUSI
    INNER JOIN
        edfi.Descriptor ON
            StudentSchoolAssociation.EntryGradeLevelDescriptorId = Descriptor.DescriptorId
    INNER JOIN
        edfi.School ON
            StudentSchoolAssociation.SchoolId = School.SchoolId
    LEFT OUTER JOIN
        edfi.StudentEducationOrganizationAssociation AS schoolEdOrg ON
            Student.StudentUSI = schoolEdOrg.StudentUSI
            AND StudentSchoolAssociation.SchoolId = schoolEdOrg.EducationOrganizationId
    LEFT OUTER JOIN
        edfi.Descriptor AS LimitedEnglishDescriptorSchool ON
            schoolEdOrg.LimitedEnglishProficiencyDescriptorId = LimitedEnglishDescriptorSchool.DescriptorId
    LEFT OUTER JOIN
        edfi.Descriptor AS SexTypeSchool ON
            schoolEdOrg.SexDescriptorId = SexTypeSchool.DescriptorId
    LEFT OUTER JOIN
        edfi.StudentEducationOrganizationAssociation AS districtEdOrg ON
            Student.StudentUSI = districtEdOrg.StudentUSI
            AND School.LocalEducationAgencyId = districtEdOrg.EducationOrganizationId
    LEFT OUTER JOIN
        edfi.Descriptor AS LimitedEnglishDescriptorDist ON
            districtEdOrg.LimitedEnglishProficiencyDescriptorId = LimitedEnglishDescriptorDist.DescriptorId
    LEFT OUTER JOIN
        edfi.Descriptor AS SexTypeDist ON
            districtEdOrg.SexDescriptorId = SexTypeDist.DescriptorId
    WHERE
Student.StudentUniqueId IS NOT NULL AND
StudentSchoolAssociation.SchoolId IS NOT NULL AND
    (
        StudentSchoolAssociation.ExitWithdrawDate IS NULL
        OR StudentSchoolAssociation.ExitWithdrawDate >= GETDATE());
