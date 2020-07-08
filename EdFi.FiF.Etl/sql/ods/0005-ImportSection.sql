SELECT DISTINCT
    CAST(s.SchoolId AS NVARCHAR) + '-' + s.LocalCourseCode + '-' + CAST(s.SchoolYear AS NVARCHAR) + '-' + s.SectionIdentifier + '-' + s.SessionName AS sectionkey,
    s.schoolid as schoolkey,
    s.localcoursecode,
    s.sessionname,
    s.sectionidentifier,
    s.schoolyear
FROM edfi.Section s
