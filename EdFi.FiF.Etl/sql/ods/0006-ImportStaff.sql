SELECT DISTINCT
    s.staffusi as staffkey,
    s.personaltitleprefix as personaltitleprefix,
    s.firstname as firstname,
    s.middlename as middlename,
    s.lastsurname as lastsurname,
    s.staffuniqueid as staffuniqueid
FROM edfi.Staff s
