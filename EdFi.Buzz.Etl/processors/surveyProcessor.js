// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

/* eslint no-param-reassign: ["error", { "props": false }] */
const dotnet = require('dotenv');

dotnet.config();
const csv = require('csv-parser');
const fs = require('fs');
const { Client } = require('pg');
const { pgConfig } = require('../config/dbs');

const SURVEY_DATE_FIELD = 'Timestamp';
const STUDENT_SCHOOL_KEY_FIELD = 'StudentUniqueId';
const METADATA_FIELDS = [SURVEY_DATE_FIELD, STUDENT_SCHOOL_KEY_FIELD, 'FirstName', 'LastSurname', 'ElectronicMailAddress', 'GradeLevel', 'StudentsELATeacher'];

async function getDB() {
  const connectionString = `postgres://${pgConfig.user}:${pgConfig.password}@${pgConfig.host}:${pgConfig.port}/${pgConfig.database}`;

  const client = new Client({ connectionString });
  await client.connect()
    .catch((e) => console.error(e));
  return client;
}

async function isAdminSurveyLoader(staffkey, db) {
  return db
    .query('SELECT isadminsurveyloader FROM buzz.staff where staffkey = $1;', [staffkey])
    .then(async (result) => {
      return Boolean(result.rows[0]);
    });
}

async function Extract(fileName) {
  let questions = null;
  const answers = [];
  return new Promise((resolve) => {
    fs.createReadStream(fileName)
      .pipe(csv())
      .on('headers', (headers) => { questions = headers; })
      .on('data', (row) => answers.push(row))
      .on('end', () => {
        resolve({ questions, answers });
      });
  });
}

async function getOrSaveSurvey(surveytitle, db) {
  return db
    .query('SELECT surveykey, title FROM buzz.survey where title = $1;', [surveytitle])
    .then(async (result) => {
      if (result.rows.length === 0) {
        return db
          .query('INSERT INTO buzz.survey (title) VALUES($1) RETURNING surveykey, title;', [surveytitle])
          .then((resultInsert) => resultInsert.rows[0]);
      }
      return result.rows[0];
    })
    .catch((e) => console.error(e));
}

async function getQuestions(surveykey, db) {
  return db.query('SELECT * FROM buzz.surveyquestion sq where sq.surveykey = $1', [surveykey])
    .then((result) => result.rows);
}

async function getOrSaveQuestions(questions, surveykey, db) {
  const dbQuestions = await getQuestions(surveykey, db);
  const toSave = questions
    .filter((h) => !dbQuestions.some((q) => q.question.toUpperCase() === h.toUpperCase())
      && !METADATA_FIELDS.some((f) => f.toUpperCase() === h.toUpperCase()));

  const insertPromises = [];

  for (let i = 0; i < toSave.length; i += 1) {
    insertPromises.push(db.query('INSERT INTO buzz.surveyquestion (surveykey, question) VALUES($1, $2);', [surveykey, toSave[i]]));
  }
  await Promise.allSettled(insertPromises);

  return db.query('SELECT * FROM buzz.surveyquestion sq where sq.surveykey = $1', [surveykey])
    .then((result) => result.rows);
}

async function getOrSaveStudentSurvey(surveykey, studentAnswers, db) {
  const date = studentAnswers[SURVEY_DATE_FIELD];
  const studentkey = studentAnswers[STUDENT_SCHOOL_KEY_FIELD];
  const studentSchoolKeyRow = await db.query('SELECT studentschoolkey FROM buzz.studentschool s WHERE studentkey = $1', [studentkey]);
  if (studentSchoolKeyRow.rows.length === 0) {
    console.error(`ERROR: StudentUniqueId (${studentkey}) not found `);
    return null;
  }
  const { studentschoolkey } = studentSchoolKeyRow.rows[0];

  const result = await db
    .query('SELECT studentsurveykey, surveykey, studentschoolkey, "date" FROM buzz.studentsurvey where surveykey = $1 and studentschoolkey = $2; ', [surveykey, studentschoolkey]);

  if (result.rows.length > 0) { return result.rows[0]; }

  return db
    .query('INSERT INTO buzz.studentsurvey (surveykey, studentschoolkey, "date") VALUES($1, $2, $3) RETURNING *;', [surveykey, studentschoolkey, date])
    .then((resultInsert) => resultInsert.rows[0])
    .catch((err) => { console.error(`ERROR: ${err.detail}`); return null; });
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
      promises.push(db
        .query(`
INSERT INTO buzz.studentsurveyanswer (studentsurveykey, surveyquestionkey, answer)
SELECT $1, $2, $3
WHERE NOT EXISTS (SELECT FROM buzz.studentsurveyanswer WHERE studentsurveykey = $1 AND surveyquestionkey = $2)
`, [studentsurvey.studentsurveykey, questionKeyMap[q], currentAnswer[q]])
        .then((result) => {
          if (result.rowCount > 0) {
            surveyProfile.answers.load += 1;
          } else {
            surveyProfile.answers.alreadyLoaded += 1;
          }
        }));
    }
  }
  return Promise.allSettled(promises);
}

async function saveAllStudentsAnswers(staffkey, surveykey, questions,
  studentSurveyAnswers, db, surveyProfile) {
  const questionKeyMap = {};
  questions.forEach((element) => {
    questionKeyMap[element.question] = element.surveyquestionkey;
  });
  const promises = [];
  for (let i = 0; i < studentSurveyAnswers.length; i += 1) {
    const currentAnswer = studentSurveyAnswers[i];
    promises.push(getOrSaveStudentSurvey(staffkey, surveykey, currentAnswer, db)
      .then((studentsurvey) => saveStudentAnswers(studentsurvey, questionKeyMap,
        currentAnswer, db, surveyProfile)));
  }
  return Promise.allSettled(promises);
}

async function Load(staffkey, surveytitle, questions, answers, db) {
  const survey = await getOrSaveSurvey(surveytitle, db);
  const surveyProfile = {
    survey,
    answers: {
      load: 0,
      rejected: 0,
      alreadyLoaded: 0,
    },
  };
  survey.questions = await getOrSaveQuestions(questions, survey.surveykey, db);
  await saveAllStudentsAnswers(
    staffkey, survey.surveykey, survey.questions, answers, db, surveyProfile,
  );
  await db.end();
  return surveyProfile;
}

const process = async (staffkey, surveytitle, filename) => {
  const db = await getDB();
  if (!(await isAdminSurveyLoader(staffkey, db))) {
    throw new Error(`staffkey:${staffkey} is not allowed to upload surveys`);
  }

  const data = await Extract(filename);
  const result = await Load(staffkey, surveytitle, data.questions, data.answers, db);
  console.log('result:', {
    survey: {
      surveykey: result.survey.surveykey,
      title: result.survey.title,
      questions: result.survey.questions.length,
    },
    answers: result.answers,
  });
};

exports.process = process;
