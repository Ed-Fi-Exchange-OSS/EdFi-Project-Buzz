SELECT DISTINCT
    s.staffusi as staffkey,
    s.personaltitleprefix as personaltitleprefix,
    s.firstname as firstname,
    s.middlename as middlename,
    s.lastsurname as lastsurname,
    s.staffuniqueid as staffuniqueid,
    (SELECT TOP 1 m.ElectronicMailAddress
      FROM edfi.StaffElectronicMail m
      WHERE m.staffusi = s.staffusi) as electronicmailaddress
FROM edfi.Staff s
