SELECT DISTINCT
    s.sectionidentifier as sectionkey,
    s.schoolid as schoolkey,
    s.localcoursecode,
    s.sessionname,
    s.sectionidentifier,
    s.schoolyear
FROM edfi.Section s
