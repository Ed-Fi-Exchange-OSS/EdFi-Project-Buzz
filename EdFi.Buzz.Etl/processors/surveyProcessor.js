// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

/* eslint no-param-reassign: ["error", { "props": false }] */
const dotnet = require('dotenv');

dotnet.config();
const csv = require('csv-parser');
const path = require('path');
const fs = require('fs');
const { Client } = require('pg');
const { pgConfig } = require('../config/dbs');
const { jobStatusEnum } = require('../config/jobStatusEnum');

const SURVEY_DATE_FIELD = 'Timestamp';
const STUDENT_SCHOOL_KEY_FIELD = 'StudentUniqueId';
const METADATA_FIELDS = [
  SURVEY_DATE_FIELD,
  STUDENT_SCHOOL_KEY_FIELD,
  'FirstName',
  'LastSurname',
  'ElectronicMailAddress',
  'GradeLevel',
  'StudentsELATeacher',
];

async function getDB() {
  const connectionString = `postgres://${pgConfig.user}:${pgConfig.password}@${pgConfig.host}:${pgConfig.port}/${pgConfig.database}`;

  const client = new Client({ connectionString });
  await client.connect().catch((e) => console.error(e));
  return client;
}

async function isSurveyLoader(staffkey, db) {
  return db
    .query('SELECT isadminsurveyloader, isteachersurveyloader FROM buzz.staff where staffkey = $1;', [staffkey])
    .then(async (result) => {
      const { isadminsurveyloader, isteachersurveyloader } = result.rows[0];
      return Boolean(isadminsurveyloader) || Boolean(isteachersurveyloader);
    });
}

async function Extract(fileName) {
  let questions = null;
  const answers = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(fileName)
      .on('error', (err) => reject(err))
      .pipe(csv())
      .on('headers', (headers) => {
        questions = headers;
      })
      .on('data', (row) => answers.push(row))
      .on('end', () => {
        resolve({ questions, answers });
      });
  });
}

async function saveSurveyStatus(surveykey, jobstatuskey, summary, jobkey, db) {
  return db
    .query('UPDATE buzz.surveystatus SET surveykey=$1, jobstatuskey=$2, resultsummary=$3 WHERE jobkey=$4;', [surveykey, jobstatuskey, summary, jobkey])
    .then((result) => result.rows)
    .catch((err) => {
      console.error(`ERROR: ${err} - ${err.detail}`);
      return null;
    });
}

async function getOrSaveSurvey(surveytitle, staffkey, db) {
  return db
    .query('SELECT surveykey, title FROM buzz.survey where deletedat IS NULL AND title = $1 and staffkey = $2;', [surveytitle, staffkey])
    .then(async (result) => {
      if (result.rows.length === 0) {
        return db
          .query('INSERT INTO buzz.survey (title, staffkey) VALUES($1, $2) RETURNING surveykey, title, staffkey;', [surveytitle, staffkey])
          .then((resultInsert) => resultInsert.rows[0]);
      }
      return result.rows[0];
    })
    .catch((e) => console.error(e));
}

async function getQuestions(surveykey, db) {
  return db.query('SELECT * FROM buzz.surveyquestion sq where sq.surveykey = $1', [surveykey]).then((result) => result.rows);
}

async function getOrSaveQuestions(questions, surveykey, db) {
  const dbQuestions = await getQuestions(surveykey, db);
  const toSave = questions.filter(
    (h) => !dbQuestions.some((q) => q.question.toUpperCase() === h.toUpperCase())
      && !METADATA_FIELDS.some((f) => f.toUpperCase() === h.toUpperCase()),
  );

  const insertPromises = [];

  for (let i = 0; i < toSave.length; i += 1) {
    insertPromises.push(
      db.query('INSERT INTO buzz.surveyquestion (surveykey, question) VALUES($1, $2);', [surveykey, toSave[i]]),
    );
  }
  await Promise.allSettled(insertPromises);

  return db.query('SELECT * FROM buzz.surveyquestion sq where sq.surveykey = $1', [surveykey]).then((result) => result.rows);
}

async function getOrSaveStudentSurvey(staffkey, surveykey, studentAnswers, db, console) {
  const surveyDateField = studentAnswers[SURVEY_DATE_FIELD];
  const studentkey = studentAnswers[STUDENT_SCHOOL_KEY_FIELD];

  const studentSchoolKeyRow = await db.query(
    'SELECT DISTINCT s.studentschoolkey FROM buzz.studentschool s INNER JOIN buzz.studentsection ss ON s.studentschoolkey = ss.studentschoolkey INNER JOIN buzz.staffsectionassociation ssa ON ss.sectionkey = ssa.sectionkey WHERE s.studentkey = $1 AND ssa.staffkey = $2 AND EXISTS(SELECT staff.isteachersurveyloader FROM buzz.staff WHERE staff.staffkey=$2 AND staff.isteachersurveyloader = TRUE) UNION SELECT DISTINCT s.studentschoolkey FROM buzz.studentschool s INNER JOIN buzz.studentsection ss ON s.studentschoolkey = ss.studentschoolkey CROSS JOIN buzz.staff staff WHERE s.studentkey = $1 AND (staff.staffkey = $2 and staff.isadminsurveyloader = true)',
    [studentkey, staffkey],
  );
  if (studentSchoolKeyRow.rows.length === 0) {
    console.error(`ERROR: StudentUniqueId (${studentkey}) not found as a valid student for staff (${staffkey}) `);
    return null;
  }

  const { studentschoolkey } = studentSchoolKeyRow.rows[0];

  const result = await db.query(
    'SELECT studentsurveykey, surveykey, studentschoolkey, "date" FROM buzz.studentsurvey where surveykey = $1 and studentschoolkey = $2; ',
    [surveykey, studentschoolkey],
  );
  if (result.rows.length > 0) {
    return result.rows[0];
  }

  return db
    .query('INSERT INTO buzz.studentsurvey (surveykey, studentschoolkey, "date") VALUES($1, $2, $3) RETURNING *;', [
      surveykey,
      studentschoolkey,
      surveyDateField,
    ])
    .then((resultInsert) => resultInsert.rows[0])
    .catch((err) => {
      console.error(`ERROR: ${err.detail}`);
      return null;
    });
}

async function saveStudentAnswers(studentsurvey, questionKeyMap, currentAnswer, db, surveyProfile) {
  if (!studentsurvey) {
    surveyProfile.answers.rejected += 1;
    return Promise.resolve();
  }
  const currentAnswerKeys = Object.keys(currentAnswer);
  const promises = [];
  for (let j = 0; j < currentAnswerKeys.length; j += 1) {
    const q = currentAnswerKeys[j];
    if (questionKeyMap[q]) {
      promises.push(
        db
          .query(
            `
INSERT INTO buzz.studentsurveyanswer (studentsurveykey, surveyquestionkey, answer)
SELECT $1, $2, $3
WHERE NOT EXISTS (SELECT FROM buzz.studentsurveyanswer WHERE studentsurveykey = $1 AND surveyquestionkey = $2)
`,
            [studentsurvey.studentsurveykey, questionKeyMap[q], currentAnswer[q]],
          )
          .then((result) => {
            if (result.rowCount > 0) {
              surveyProfile.answers.load += 1;
            } else {
              surveyProfile.answers.alreadyLoaded += 1;
            }
          }),
      );
    }
  }
  return Promise.allSettled(promises);
}

async function saveAllStudentsAnswers(
  staffkey, surveykey, questions,
  studentSurveyAnswers, db, surveyProfile,
) {
  const questionKeyMap = {};
  questions.forEach((element) => {
    questionKeyMap[element.question] = element.surveyquestionkey;
  });
  const promises = [];
  for (let i = 0; i < studentSurveyAnswers.length; i += 1) {
    const currentAnswer = studentSurveyAnswers[i];
    promises.push(
      getOrSaveStudentSurvey(staffkey, surveykey, currentAnswer, db)
        .then((studentsurvey) => saveStudentAnswers(
          studentsurvey, questionKeyMap, currentAnswer, db, surveyProfile,
        )),
    );
  }
  return Promise.allSettled(promises);
}

async function Load(staffkey, jobkey,
  surveytitle, questions, answers, db) {
  const survey = await getOrSaveSurvey(surveytitle, staffkey, db);
  const surveyProfile = {
    survey,
    answers: {
      load: 0,
      rejected: 0,
      alreadyLoaded: answers.alreadyLoaded,
    },
  };
  saveSurveyStatus(survey.surveykey, jobStatusEnum.PROCESSING, '', jobkey, db);
  survey.questions = await getOrSaveQuestions(questions, survey.surveykey, db);
  await saveAllStudentsAnswers(staffkey, survey.surveykey,
    survey.questions, answers, db, surveyProfile);
  const summary = `{"result": {"survey":{
      "surveykey": ${survey.surveykey},"title": "${survey.title}","questions": ${survey.questions.length}},
      "process":${JSON.stringify(surveyProfile.answers)}}}`;
  await saveSurveyStatus(survey.surveykey, jobStatusEnum.COMPLETED, summary.replace(/\n/g, ' '), jobkey, db);
  await db.end();
  return surveyProfile;
}

async function getExistingSurvey(db, staffkey, surveytitle) {
  return db.query(`
      SELECT false as updatesurvey
      WHERE NOT EXISTS(SELECT surveykey
      FROM buzz.survey
      WHERE
      staffkey=$1 AND deletedat IS NULL AND title = $2)
      UNION
      SELECT true as updatesurvey
      FROM buzz.survey
      WHERE
      deletedat IS NULL AND
      staffkey=$1 AND
      title = $2`, [staffkey, surveytitle])
    .then(async (result) => {
      console.debug(`${JSON.stringify(result.rows[0])}`);
      return result.rows[0];
    })
    .catch((err) => {
      console.error(`ERROR: ${JSON.stringify(err)}`);
      return null;
    });
}

async function deleteSurvey(db, surveytitle, staffkey) {
  const d = new Date();
  const datestring = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  return db.query(`
  UPDATE buzz.survey SET deletedat=$1 WHERE title=$2 AND staffkey=$3;`,
  [datestring, surveytitle, staffkey])
    .then((result) => result.result)
    .catch((err) => {
      console.error(`ERROR: ${err} - ${err.detail}`);
      return null;
    });
}

async function deleteSurveyAnswers(db, surveytitle, staffkey) {
  return db.query(`
  UPDATE buzz.studentsurveyanswer
  SET deletedat = buzz.survey.deletedat
  FROM buzz.studentsurvey
  JOIN buzz.survey USING (surveykey)
  WHERE
    survey.title=$1 AND
    survey.staffkey=$2 AND
    survey.deletedat IS NOT NULL AND
    buzz.studentsurveyanswer.studentsurveykey = buzz.studentsurvey.studentsurveykey;`,
  [surveytitle, staffkey])
    .then((result) => result.rowCount)
    .catch((err) => {
      console.error(`ERROR: ${err} - ${err.detail}`);
      return null;
    });
}

const process = async (staffkey, surveytitle, filename, filePath, jobkey) => {
  const db = await getDB();
  if (!(await isSurveyLoader(staffkey, db))) {
    throw new Error(`staffkey:${staffkey} is not allowed to upload surveys`);
  }

  let alreadyLoaded = 0;
  const { updatesurvey } = await getExistingSurvey(db, staffkey, surveytitle);
  if (updatesurvey) {
    await deleteSurvey(db, surveytitle, staffkey);
    alreadyLoaded = await deleteSurveyAnswers(db, surveytitle, staffkey);
  }

  const data = await Extract(path.join(filePath, filename));
  data.answers.alreadyLoaded = alreadyLoaded;
  const result = await Load(
    staffkey, jobkey,
    surveytitle, data.questions, data.answers, db,
  );

  console.info('result:', {
    survey: {
      surveykey: result.survey.surveykey,
      title: result.survey.title,
      questions: result.survey.questions.length,
    },
    answers: result.answers,
  });
};

exports.process = process;
