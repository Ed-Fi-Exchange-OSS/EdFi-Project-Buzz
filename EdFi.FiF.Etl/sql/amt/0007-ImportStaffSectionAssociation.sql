SELECT DISTINCT
    ssa.staffusi as staffkey,
    CAST(ssa.SchoolId AS NVARCHAR) + '-' + ssa.LocalCourseCode + '-' + CAST(ssa.SchoolYear AS NVARCHAR) + '-' + ssa.SectionIdentifier + '-' + ssa.SessionName AS sectionkey,
    ssa.begindate as begindate,
    ssa.enddate as enddate
FROM edfi.StaffSectionAssociation ssa

