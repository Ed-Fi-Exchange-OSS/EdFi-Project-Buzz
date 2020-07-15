const fs = require('fs');
const path = require('path');

const sqlSourceDir = `./../sql/${process.env.BUZZ_SQLSOURCE || 'amt'}/`;

const schoolSource = `${sqlSourceDir}/0001-ImportSchool.sql`;
const studentSchoolSource = `${sqlSourceDir}/0002-ImportStudentSchool.sql`;
const contactPersonSource = `${sqlSourceDir}/0003-ImportContactPerson.sql`;
const studentContactSource = `${sqlSourceDir}/0004-ImportStudentContact.sql`;
const sectionSource = `${sqlSourceDir}/0005-ImportSection.sql`;
const staffSource = `${sqlSourceDir}/0006-ImportStaff.sql`;
const staffSectioNSource = `${sqlSourceDir}/0007-ImportStaffSectionAssociation.sql`;
const studentSectionSource = `${sqlSourceDir}/0008-ImportStudentSection.sql`;

const schoolSourceSQL = fs.readFileSync(path.join(__dirname, schoolSource), 'utf8');
const studentSchoolSourceSQL = fs.readFileSync(path.join(__dirname, studentSchoolSource), 'utf8');
const contactPersonSourceSQL = fs.readFileSync(path.join(__dirname, contactPersonSource), 'utf8');
const studentContactSourceSQL = fs.readFileSync(path.join(__dirname, studentContactSource), 'utf8');
const sectionSourceSQL = fs.readFileSync(path.join(__dirname, sectionSource), 'utf8');
const staffSourceSQL = fs.readFileSync(path.join(__dirname, staffSource), 'utf8');
const staffSectionSourceSQL = fs.readFileSync(path.join(__dirname, staffSectioNSource), 'utf8');
const studentSectionSourceSQL = fs.readFileSync(path.join(__dirname, studentSectionSource), 'utf8');

exports.schoolConfig = {
  recordType: 'School',
  selectSql: 'SELECT 1 FROM buzz.school WHERE schoolkey=$1',
  insertSql: 'INSERT INTO buzz.school(schoolkey, schoolname, schooltype, schooladdress, schoolcity, schoolcounty, schoolstate, localeducationagencyname, localeducationagencykey, stateeducationagencyname, stateeducationagencykey, educationservicecentername, educationservicecenterkey,lastmodifieddate) VALUES ($1::text, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13,$14)',
  updateSql: 'UPDATE buzz.school SET schoolkey=$1, schoolname=$2, schooltype=$3, schooladdress=$4, schoolcity=$5, schoolcounty=$6, schoolstate=$7, localeducationagencyname=$8, localeducationagencykey=$9, stateeducationagencyname=$10, stateeducationagencykey=$11, educationservicecentername=$12, educationservicecenterkey=$13, lastmodifieddate=$14 WHERE schoolkey=$1;',
  sourceSql: schoolSourceSQL,
  keyIndex: 0,
  isEntityMap: false,
  valueFunc: (row) => [
    row.schoolkey,
    row.schoolname,
    row.schooltype,
    row.schooladdress,
    row.schoolcity,
    row.schoolcounty,
    row.schoolstate,
    row.localeducationagencyname,
    row.localeducationagencykey,
    row.stateeducationagencyname,
    row.stateeducationagencykey,
    row.educationservicecentername,
    row.educationservicecenterkey,
    row.lastmodifieddate,
  ],
};

exports.studentSchoolConfig = {
  recordType: 'StudentSchool',
  selectSql: 'SELECT 1 FROM buzz.studentschool WHERE studentschoolkey=$1',
  insertSql: 'INSERT INTO buzz.studentschool (studentschoolkey, studentkey, schoolkey, schoolyear, studentfirstname, studentmiddlename, studentlastname, enrollmentdatekey, gradelevel, limitedenglishproficiency, ishispanic, sex) VALUES ($1::text, $2::text, $3::text, $4::text, $5::text, $6::text, $7::text, $8::text, $9::text, $10::text, $11::bit, $12::text)',
  updateSql: 'UPDATE buzz.studentschool SET studentkey = $2, schoolkey = $3, schoolyear = $4, studentfirstname = $5, studentmiddlename = $6, studentlastname = $7, enrollmentdatekey = $8, gradelevel = $9, limitedenglishproficiency = $10, ishispanic = $11, sex = $12 WHERE studentschoolkey=$1',
  sourceSql: studentSchoolSourceSQL,
  keyIndex: 0,
  isEntityMap: false,
  valueFunc: (row) => [
    row.studentschoolkey,
    row.studentkey,
    row.schoolkey,
    row.schoolyear,
    row.studentfirstname,
    row.studentmiddlename,
    row.studentlastname,
    row.enrollmentdatekey,
    row.gradelevel,
    row.limitedenglishproficiency,
    (row.ishispanic === 'true') ? 1 : 0,
    row.sex,
  ],
};

exports.contactPersonConfig = {
  recordType: 'ContactPerson',
  selectSql: 'SELECT 1 FROM buzz.contactperson WHERE uniquekey=$1',
  insertSql: 'INSERT INTO buzz.contactperson (uniquekey, contactpersonkey, studentkey, contactfirstname, contactlastname, relationshiptostudent, streetnumbername, apartmentroomsuitenumber, state, postalcode, phonenumber, primaryemailaddress, isprimarycontact, preferredcontactmethod, besttimetocontact, contactnotes) VALUES ($1::text, $2::text, $3::text, $4::text, $5::text, $6::text, $7::text, $8::text, $9::text, $10::text, $11::text, $12::text, $13, $14::text, $15::text, $16::text)',
  updateSql: 'UPDATE buzz.contactperson SET contactpersonkey=$2, studentkey=$3, contactfirstname=$4, contactlastname=$5, relationshiptostudent=$6, streetnumbername=$7, apartmentroomsuitenumber=$8, state=$9, postalcode=$10, phonenumber=$11, primaryemailaddress=$12, isprimarycontact=$13, preferredcontactmethod=$14, besttimetocontact=$15, contactnotes=$16 WHERE uniquekey= $1',
  sourceSql: contactPersonSourceSQL,
  keyIndex: 0,
  isEntityMap: false,
  valueFunc: (row) => [
    row.uniquekey,
    row.contactpersonkey,
    row.studentkey,
    row.contactfirstname,
    row.contactlastname,
    row.relationshiptostudent,
    row.streetnumbername,
    row.apartmentroomsuitenumber,
    row.state,
    row.postalcode,
    row.phonenumber,
    row.primaryemailaddress,
    (row.isprimarycontact === 'true') ? 1 : 0,
    row.preferredcontactmethod,
    row.besttimetocontact,
    row.contactnotes,
  ],
};

exports.studentContactConfig = {
  recordType: 'StudentContact',
  deleteSql: 'DELETE FROM buzz.studentcontact',
  insertSql: 'INSERT INTO buzz.studentcontact (contactkey, studentschoolkey) SELECT $1::text, $2::text WHERE EXISTS(SELECT 1 FROM buzz.contactperson WHERE uniquekey = $1) AND  EXISTS(SELECT 1 FROM buzz.studentschool WHERE studentschoolkey = $2)',
  sourceSql: studentContactSourceSQL,
  keyIndex: 0,
  isEntityMap: true,
  valueFunc: (row) => [
    row.contactkey,
    row.studentschoolkey,
  ],
};

exports.sectionConfig = {
  recordType: 'Section',
  selectSql: 'SELECT 1 FROM buzz.section WHERE sectionkey=$1',
  insertSql: 'INSERT INTO buzz.section (sectionkey, schoolkey, localcoursecode, sessionname, sectionidentifier, schoolyear) VALUES ($1, $2, $3, $4, $5, $6)',
  updateSql: 'UPDATE buzz.section SET schoolkey=$2, localcoursecode=$3, sessionname=$4, sectionidentifier=$5, schoolyear=$6 WHERE sectionkey=$1',
  sourceSql: sectionSourceSQL,
  keyIndex: 0,
  isEntityMap: false,
  valueFunc: (row) => [
    row.sectionkey,
    row.schoolkey,
    row.localcoursecode,
    row.sessionname,
    row.sectionidentifier,
    row.schoolyear,
  ],
};

exports.staffConfig = {
  recordType: 'Staff',
  selectSql: 'SELECT 1 FROM buzz.staff WHERE staffkey=$1',
  insertSql: 'INSERT INTO buzz.staff (staffkey, personaltitleprefix, firstname, middlename, lastsurname, staffuniqueid, electronicmailaddress) VALUES ($1, $2, $3, $4, $5, $6, $7)',
  updateSql: 'UPDATE buzz.staff SET personaltitleprefix=$2, firstname=$3, middlename=$4, lastsurname=$5, staffuniqueid=$6, electronicmailaddress=$7 WHERE staffkey=$1',
  sourceSql: staffSourceSQL,
  keyIndex: 0,
  isEntityMap: false,
  valueFunc: (row) => [
    row.staffkey,
    row.personaltitleprefix,
    row.firstname,
    row.middlename,
    row.lastsurname,
    row.staffuniqueid,
    row.electronicmailaddress,
  ],
};

exports.staffSectionConfig = {
  recordType: 'StaffSection',
  deleteSql: 'DELETE FROM buzz.staffsectionassociation',
  insertSql: 'INSERT INTO buzz.staffsectionassociation (staffkey, sectionkey, begindate, enddate)  VALUES ($1, $2::text, $3, $4) ON CONFLICT (sectionkey, staffkey) DO NOTHING',
  sourceSql: staffSectionSourceSQL,
  keyIndex: 0,
  isEntityMap: true,
  valueFunc: (row) => [
    row.staffkey,
    row.sectionkey,
    row.begindate,
    row.enddate,
  ],
};

exports.studentSectionConfig = {
  recordType: 'StudentSection',
  deleteSql: 'DELETE FROM buzz.studentsection',
  insertSql: 'INSERT INTO buzz.studentsection (studentsectionkey, studentschoolkey, studentkey, sectionkey, localcoursecode, subject, coursetitle, teachername, studentsectionstartdatekey, studentsectionenddatekey, schoolkey, schoolyear) VALUES ($1::text, $2::text, $3::text, $4::text, $5::text, $6::text, $7::text, $8::text, $9::text, $10::text, $11::text, $12::text) ON CONFLICT (studentsectionkey) DO NOTHING',
  sourceSql: studentSectionSourceSQL,
  keyIndex: 0,
  isEntityMap: true,
  valueFunc: (row) => [
    row.studentsectionkey,
    row.studentschoolkey,
    row.studentkey,
    row.sectionkey,
    row.localcoursecode,
    row.subject,
    row.coursetitle,
    row.teachername,
    row.studentsectionstartdatekey,
    row.studentsectionenddatekey,
    row.schoolkey,
    row.schoolyear,
  ],
};
