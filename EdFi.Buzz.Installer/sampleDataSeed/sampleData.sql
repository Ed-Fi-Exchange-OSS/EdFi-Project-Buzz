-- SPDX-License-Identifier: Apache-2.0
-- Licensed to the Ed-Fi Alliance under one or more agreements.
-- The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
-- See the LICENSE and NOTICES files in the project root for more information.

-- SCHOOL

WITH source AS (VALUES
	('100001','Carter','Regular','2600 1ST ST, GlendaleTX 75862-0001','Glendale','','TX','Glendale ISD',867530,'','ESC Region 17',152950,NOW())
)
INSERT INTO 
    buzz.school
(
	schoolkey, 
  schoolname, 
  schooltype, 
  schooladdress, 
  schoolcity, 
  schoolcounty, 
  schoolstate, 
  localeducationagencyname, 
  localeducationagencykey, 
  stateeducationagencyname, 
  educationservicecentername, 
  educationservicecenterkey, 
  lastmodifieddate
)
SELECT
  source.column1,
  source.column2,
  source.column3,
  source.column4,
  source.column5,
  source.column6,
  source.column7,
  source.column8,
  source.column9,
  source.column10,
  source.column11,
  source.column12,
  source.column13
FROM
    source
ON CONFLICT DO NOTHING;

-- STAFF

WITH source AS (VALUES
	(100001,  'Sir.',   'David',  'B',  'Smith',    '100001', 'projectbuzzdemo@gmail.com',	false, false),
	(100002,  'Mrs.',   'Joyce',  'M',  'Simpson',  '100002', 'jsimpson@gmail.com',   		  false, true),
	(100003,  'Mr.',    'Thomas', 'A',  'Johnson',  '100003', 'tjohnson@gmail.com',   		  true,  false)
)
INSERT INTO 
    buzz.staff
(
	StaffKey,
	PersonalTitlePrefix,
  FirstName,
  MiddleName,
  LastSurname,
  StaffUniqueId,
  ElectronicMailAddress,
  isadminsurveyloader,
  isteachersurveyloader
)
SELECT
  source.column1,
  source.column2,
  source.column3,
  source.column4,
  source.column5,
  source.column6,
  source.column7,
  source.column8,
  source.column9
FROM
    source
ON CONFLICT DO NOTHING;

-- SECTION

WITH source AS (VALUES
	('100001-MHTR07-2012-6226-2-Traditional',               '100001',   'MHTR07',  'Traditional',                 '6226-2', 2012),
  ('100001-MHTR07-2012-6225-Traditional-Spring Semester', '100001',   'MHTR07',  'Traditional-Spring Semester', '6225',   2012)
)
INSERT INTO 
    buzz.section
(
	sectionkey,
  schoolkey,
  localcoursecode,
  sessionname,
  sectionidentifier,
  schoolyear
)
SELECT
  source.column1,  
  source.column2,
  source.column3,
  source.column4,
  source.column5,
  source.column6  
FROM
    source
ON CONFLICT DO NOTHING;

-- STUDENT

WITH source AS (VALUES
	('100001-100001','100001','100001','Unknown','Kendrick',  'N',  'Henderson',  '2011-08-22','Tenth grade',   'Not applicable',0::bit,'Male'),
  ('100002-100001','100002','100001','Unknown','Stormy',    'D',  'Serna',      '2011-08-22','Ninth grade',   'Not applicable',0::bit,'Male'),
  ('100003-100001','100003','100001','Unknown','Rommel',    'B',  'Dunbar',     '2011-08-22','Eighth grade',  'Not applicable',0::bit,'Male'),
  ('100004-100001','100004','100001','Unknown','Karina',    'F',  'Walke',      '2011-08-22','Eighth grade',  'Not applicable',0::bit,'Female'),
  ('100005-100001','100005','100001','Unknown','Fran',      'Q',  'Lemay',      '2011-08-22','Seventh grade', 'Not applicable',0::bit,'Female'),
  ('100006-100001','100006','100001','Unknown','Andrew',    'J',  'Henderson',  '2011-08-22','Sixth grade',   'Not applicable',0::bit,'Female'),
  ('100007-100001','100007','100001','Unknown','Irene',     'V',  'Alfaro',     '2011-08-22','Ninth grade',   'Not applicable',1::bit,'Female'),
  ('100008-100001','100008','100001','Unknown','Rebecca',   'G',  'Numbers',    '2011-08-22','Seventh grade', 'Not applicable',0::bit,'Female')
)
INSERT INTO 
    buzz.studentschool
(
	studentschoolkey,
  studentkey,
  schoolkey,
  schoolyear,
  studentfirstname,
  studentmiddlename,
  studentlastname,
  enrollmentdatekey,
  gradelevel,
  limitedenglishproficiency,
  ishispanic,
  sex
)
SELECT
  source.column1,
  source.column2,
  source.column3,
  source.column4,
  source.column5,
  source.column6,
  source.column7,
  source.column8,
  source.column9,
  source.column10,
  source.column11,
  source.column12
FROM
    source
ON  CONFLICT DO NOTHING;

-- STUDENT SECTION

WITH source AS (VALUES
	('100001-100001-MHTR07-2012-6226-2-Traditional-20110822',               '100001-100001','100001','100001-MHTR07-2012-6226-2-Traditional',               'ZADV11', 'Other',                                  'Other Secondary Subject',                'Jennifer Aguiar',  20110822,20111220,'100001',2012),
  ('100002-100001-MHTR07-2012-6226-2-Traditional-20110822',               '100002-100001','100002','100001-MHTR07-2012-6226-2-Traditional',               'LJOR21', '',                                       'Journalism (1/2-1 Unit)',                'Kelly Mcguire',    20110822,20111220,'100001',2012),
  ('100003-100001-MHTR07-2012-6226-2-Traditional-20110822',               '100003-100001','100003','100001-MHTR07-2012-6226-2-Traditional',               'STEM07', 'Science',                                'SCI-TECH-ENG-MTH-07',                    'Kelly Mcguire',    20110822,20111220,'100001',2012),
  ('100004-100001-MHTR07-2012-6226-2-Traditional-20110822',               '100004-100001','100004','100001-MHTR07-2012-6226-2-Traditional',               'STEM07', 'Other',                                  'Other Secondary Subject',                'Luis Howard',      20110822,20111220,'100001',2012),
  ('100005-100001-MHTR07-2012-6225-Traditional-Spring Semester-20110822', '100005-100001','100005','100001-MHTR07-2012-6225-Traditional-Spring Semester', 'FSP78A', 'Foreign Language and Literature',        'Lang /T/ Eng Lvl I (1 Unit) - Spanish',  'Amber Mcneil',     20110822,20111220,'100001',2012),
  ('100006-100001-MHTR07-2012-6225-Traditional-Spring Semester-20110822', '100006-100001','100006','100001-MHTR07-2012-6225-Traditional-Spring Semester', 'LAPH21', '',                                       'English Ii (1 Unit)',                    'Jama Jessup',      20110822,20111220,'100001',2012),
  ('100007-100001-MHTR07-2012-6225-Traditional-Spring Semester-20110822', '100007-100001','100007','100001-MHTR07-2012-6225-Traditional-Spring Semester', 'ZADV06', 'Other',                                  'Local',                                  'Erica Mcdaniels',  20110822,20111220,'100001',2012),
  ('100008-100001-MHTR07-2012-6225-Traditional-Spring Semester-20110822', '100008-100001','100008','100001-MHTR07-2012-6225-Traditional-Spring Semester', 'PEDR06', 'Physical, Health, and Safety Education', 'Physical Education, Dept. Grade 6',      'Treneicia Campos', 20110822,20111220,'100001',2012)
)
INSERT INTO 
    buzz.studentsection
(
	studentsectionkey,
  studentschoolkey,
  studentkey,
  sectionkey,
  localcoursecode,
  subject,
  coursetitle,
  teachername,
  studentsectionstartdatekey,
  studentsectionenddatekey,
  schoolkey,
  schoolyear
)
SELECT
  source.column1,
  source.column2,
  source.column3,
  source.column4,
  source.column5,
  source.column6,
  source.column7,
  source.column8,
  source.column9,
  source.column10,
  source.column11,
  source.column12
FROM
    source
ON CONFLICT DO NOTHING;

-- STAFF SECTION

WITH source AS (VALUES
	(100001,'100001-MHTR07-2012-6226-2-Traditional',                '2011-08-21'::date, '2012-05-24'::date),
  (100001,'100001-MHTR07-2012-6225-Traditional-Spring Semester',  '2011-08-21'::date, '2012-05-24'::date),
  (100002,'100001-MHTR07-2012-6226-2-Traditional',                '2011-08-21'::date, '2012-05-24'::date),
  (100003,'100001-MHTR07-2012-6225-Traditional-Spring Semester',  '2011-08-21'::date, '2012-05-24'::date)
)
INSERT INTO 
    buzz.staffsectionassociation
(
	staffkey,
  sectionkey,
  begindate,
  enddate
)
SELECT
  source.column1,  
  source.column2,
  source.column3,
  source.column4 
FROM
    source
ON CONFLICT DO NOTHING;

-- CONTACT

WITH source AS (VALUES
	('100001-100001','100001','100001','Maeve',   'Patterson',  'Other',  '(352)-609-8968','',                          true,'621 Aubrey St, Trent TX 71135',               'phone',  'Evening'),
  ('100002-100002','100002','100002','Ari',     'Mendoza',    'Other',  '(955)-989-9700','',                          true,'506 Ridgeline Way, Nordheim TX 71787',        'phone',  'After 3:00p.pm.'),
  ('100003-100003','100003','100003','Zane',    'Wheeler',    'Mother', '(948)-615-7317','',                          true,'669 Nally Rd, Krum TX 75349',                 'email',  'Any time'),
  ('100004-100004','100004','100004','Kylie',   'Woody',      'Other',  '(473)-574-8251','kylie.woody@tsds.org',      true,'669 Nally Rd, Krum TX 75349',                 'phone',  'Evening'),
  ('100005-100005','100005','100005','Zion',    'Stoddard',   'Mother', '(955)-967-2783','',                          true,'669 Nally Rd, Krum TX 75349',                 'email',  'Any time'),
  ('100006-100006','100006','100006','Quinn',   'Becks',      'Other',  '(575)-763-3575','',                          true,'537 Dawn Dr, Wylie TX 77995',                 'email',  'Any time'),
  ('100007-100007','100007','100007','Justice', 'Dickson',    'Other',  '(952)-773-8821','justice.dickson@tsds.org',  true,'656 Pleasant Valley Rd, Carrollton TX 77558', 'phone',  'After 4:00p.pm.'),
  ('100008-100008','100008','100008','Phoenix', 'Wheeler',    'Father', '(295)-849-5639','',                          true,'585 Eagle Dr, Santa Fe TX 75635',             'email',  'At night')
)
INSERT INTO 
    buzz.contactperson
(
	uniquekey,
  contactpersonkey,
  studentkey,
  contactfirstname,
  contactlastname,
  relationshiptostudent,
  phonenumber,
  primaryemailaddress,
  isprimarycontact,
  contactaddress,
  preferredcontactmethod,
  besttimetocontact
)
SELECT
  source.column1,
  source.column2,
  source.column3,
  source.column4,
  source.column5,
  source.column6,
  source.column7,
  source.column8,
  source.column9,
  source.column10,
  source.column11,
  source.column12
FROM
    source
ON CONFLICT DO NOTHING;

-- STUDENT CONTACT

WITH source AS (VALUES
	('100001-100001','100001-100001'),
  ('100002-100002','100002-100001'),
  ('100003-100003','100003-100001'),
  ('100004-100004','100004-100001'),
  ('100005-100005','100005-100001'),
  ('100006-100006','100006-100001'),
  ('100007-100007','100007-100001'),
  ('100008-100008','100008-100001')
)
INSERT INTO 
    buzz.studentcontact
(
	contactkey,
  studentschoolkey
)
SELECT
  source.column1,
  source.column2
FROM
    source
ON CONFLICT DO NOTHING;

-- SURVEY

delete from buzz.studentsurveyanswer;
delete from buzz.studentsurvey;
delete from buzz.surveyquestion;
delete from buzz.survey;

INSERT INTO 
  buzz.survey(surveykey,title,staffkey)
OVERRIDING SYSTEM VALUE
VALUES
  (2000000001, 'Internet Access',100001),
  (2000000002, 'Contact Information',100001);

-- SURVEY QUESTION

INSERT INTO 
  buzz.surveyquestion(surveyquestionkey,surveykey,question)
OVERRIDING SYSTEM VALUE
VALUES
  (2000000001, 2000000001, 'Internet Access Type'),
  (2000000002, 2000000001, 'Has school email account'),
  (2000000003, 2000000001, 'Has computer at home'),
  (2000000004, 2000000001, 'Has school student account'),

  (2000000005, 2000000002, ' Preferred contact method'),
  (2000000006, 2000000002, 'Best time to contact'),
  (2000000007, 2000000002, 'Contact notes');

-- STUDENT SURVEY

INSERT INTO 
  buzz.studentsurvey(studentsurveykey,surveykey,studentschoolkey,date)
OVERRIDING SYSTEM VALUE
VALUES
	(2000000001, 2000000001, '100001-100001', NOW()),
  (2000000002, 2000000001, '100002-100001', NOW()),
  (2000000003, 2000000001, '100003-100001', NOW()),
  (2000000004, 2000000001, '100004-100001', NOW()),
  (2000000005, 2000000001, '100005-100001', NOW()),
  (2000000006, 2000000001, '100006-100001', NOW()),
  (2000000007, 2000000001, '100007-100001', NOW()),
  (2000000008, 2000000001, '100008-100001', NOW()),
  
	(2000000009, 2000000002, '100001-100001', NOW()),
  (2000000010, 2000000002, '100002-100001', NOW()),
  (2000000011, 2000000002, '100003-100001', NOW()),
  (2000000012, 2000000002, '100004-100001', NOW()),
  (2000000013, 2000000002, '100005-100001', NOW()),
  (2000000014, 2000000002, '100006-100001', NOW()),
  (2000000015, 2000000002, '100007-100001', NOW()),
  (2000000016, 2000000002, '100008-100001', NOW());

-- SURVEY ANSWERS

INSERT INTO 
    buzz.studentsurveyanswer
(
	studentsurveykey,
  surveyquestionkey,
  answer
)
OVERRIDING SYSTEM VALUE
VALUES
	(2000000001, 2000000001, 'School Provided HotSpot'),
  (2000000001, 2000000002, 'Yes'),
  (2000000001, 2000000003, 'School provided computer'),
  (2000000001, 2000000004, 'Yes'),

  (2000000002, 2000000001, 'Other Internet type'),
  (2000000002, 2000000002, 'Yes'),
  (2000000002, 2000000003, 'Shared computer'),
  (2000000002, 2000000004, 'Yes'),

  (2000000003, 2000000001, 'No Internet'),
  (2000000003, 2000000002, 'No'),
  (2000000003, 2000000003, 'School provided computer'),
  (2000000003, 2000000004, 'Yes'),

  (2000000004, 2000000001, 'No Internet'),
  (2000000004, 2000000002, 'Yes'),
  (2000000004, 2000000003, 'Dedicated computer'),
  (2000000004, 2000000004, 'No'),

  (2000000005, 2000000001, 'School Provided HotSpot'),
  (2000000005, 2000000002, 'No'),
  (2000000005, 2000000003, 'No computer'),
  (2000000005, 2000000004, 'No'),

  (2000000006, 2000000001, 'High Internet Speed'),
  (2000000006, 2000000002, 'Yes'),
  (2000000006, 2000000003, 'Dedicated computer'),
  (2000000006, 2000000004, 'Yes'),

  (2000000007, 2000000001, 'No Internet'),
  (2000000007, 2000000002, 'No'),
  (2000000007, 2000000003, 'No computer'),
  (2000000007, 2000000004, 'Yes'),

  (2000000008, 2000000001, 'High Internet Speed'),
  (2000000008, 2000000002, 'Yes'),
  (2000000008, 2000000003, 'Shared computer'),
  (2000000008, 2000000004, 'No'),

  (2000000009, 2000000005, 'Phone'),
  (2000000009, 2000000006, '8 a.m. to 2 p.m.'),
  (2000000009, 2000000007, 'Speak louder, has a hearing problem'),

  (2000000010, 2000000005, 'EMail'),
  (2000000010, 2000000006, '8 a.m. to 2 p.m.'),
  (2000000010, 2000000007, 'Leave a message and they will call back'),

  (2000000011, 2000000005, 'EMail'),
  (2000000011, 2000000006, '6 p.m. to 9 p.m.'),
  (2000000011, 2000000007, 'Speak louder, has a hearing problem'),

  (2000000012, 2000000005, 'EMail'),
  (2000000012, 2000000006, '8 a.m. to 2 p.m.'),
  (2000000012, 2000000007, 'Speak louder, has a hearing problem'),

  (2000000013, 2000000005, 'Phone'),
  (2000000013, 2000000006, '8 a.m. to 2 p.m.'),
  (2000000013, 2000000007, 'Leave a message and they will call back'),

  (2000000014, 2000000005, 'Phone'),
  (2000000014, 2000000006, '5 p.m. to 9 p.m.'),
  (2000000014, 2000000007, 'Speaks mostly Spanish'),

  (2000000015, 2000000005, 'EMail'),
  (2000000015, 2000000006, '8 a.m. to 2 p.m.'),
  (2000000015, 2000000007, 'Speaks mostly Spanish'),

  (2000000016, 2000000005, 'EMail'),
  (2000000016, 2000000006, '6 p.m. to 9 p.m.'),
  (2000000016, 2000000007, 'Leave a message and they will call back');


-- SURVEY

delete from buzz.studentnote;

INSERT INTO 
  buzz.studentnote(studentnotekey, note, studentschoolkey, staffkey, dateadded)
OVERRIDING SYSTEM VALUE
VALUES
  (2000000001, 'This is a sample note for Kendrick Henderson',  '100001-100001', 100001, NOW()),
  (2000000002, 'This is a sample note for Stormy Serna',        '100002-100001', 100001, NOW()),
  (2000000003, 'This is a sample note for Rommel Dunbar',       '100003-100001', 100002, NOW()),
  (2000000004, 'This is a sample note for Karina Walke',        '100004-100001', 100002, NOW()),
  (2000000005, 'This is a sample note for Fran Lemay',          '100005-100001', 100003, NOW()),
  (2000000006, 'This is a sample note for Andrew Henderson',    '100006-100001', 100003, NOW()),
  (2000000007, 'This is a sample note for Irene Alfaro',        '100007-100001', 100003, NOW()),
  (2000000008, 'This is a sample note for Rebecca Numbers',     '100008-100001', 100003, NOW())
  
