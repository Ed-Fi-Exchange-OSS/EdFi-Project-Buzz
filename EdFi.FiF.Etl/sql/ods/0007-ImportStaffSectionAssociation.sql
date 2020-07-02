SELECT DISTINCT
    ssa.staffusi as staffkey,
    ssa.sectionidentifier as sectionkey,
    ssa.begindate as begindate,
    ssa.enddate as enddate
FROM edfi.StaffSectionAssociation ssa

