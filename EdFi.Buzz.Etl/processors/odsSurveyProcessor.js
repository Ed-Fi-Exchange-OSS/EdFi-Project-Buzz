// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

// TODO: Validar el DS, tiene que ser 5

/* eslint no-param-reassign: ["error", { "props": false }] */
const dotnet = require('dotenv');

dotnet.config();
const { Client } = require('pg');
const sql = require('mssql');
const config = require('../config/dbs');

const msConfig = config.mssqlConfig;
const { pgConfig } = config;

async function getDB() {
  const connectionString = `postgres://${pgConfig.user}:${pgConfig.password}@${pgConfig.host}:${pgConfig.port}/${pgConfig.database}`;

  const client = new Client({ connectionString });
  await client.connect().catch((e) => console.error(e));
  return client;
}

async function odsDs() {
  await sql.connect(msConfig);
  const version = await sql.query`
    IF (SELECT OBJECT_ID('edfi.survey')) IS NOT NULL
    BEGIN
        SELECT 'ds5' AS version
    END
    ELSE IF (SELECT OBJECT_ID('edfi.AddressType')) IS NOT NULL 
    BEGIN
        SELECT 'ds2' AS version
    END
    ELSE IF (SELECT OBJECT_ID('dbo.VersionLevel')) IS NOT NULL OR (SELECT OBJECT_ID('dbo.DeployJournal')) IS NOT NULL 
    BEGIN
        SELECT 'ds3' AS version
    END
    ELSE
    BEGIN
        SELECT 'InvalidDs' AS version
    END
  `;

  return version.recordset[0].version;
}

async function deleteSurveyIfItExists(surveyIdentifier, db) {
  return db.query(
    `
      UPDATE buzz.survey
        SET
          deletedat = $2
      WHERE
        odssurveyidentifier = $1;
      `,
    [
      surveyIdentifier,
      new Date(),
    ],
  )
    .then(() => true)
    .catch((err) => {
      console.error(`ERROR: ${err} - ${err.detail}`);
    });
}

async function getSurvey(surveyIdentifier) {
  await sql.connect(msConfig);
  const result = await sql.query`
    select 
        Survey.SurveyIdentifier,
        SurveyTitle
      from
        edfi.Survey
      where Survey.SurveyIdentifier = ${surveyIdentifier};
    `;

  return result.recordset[0];
}

async function getSurveyQuestions(surveyIdentifier) {
  await sql.connect(msConfig);
  const result = await sql.query`
    select 
      SurveyIdentifier,
      QuestionCode,
      QuestionText
    from
      edfi.SurveyQuestion
    where
      SurveyQuestion.SurveyIdentifier = ${surveyIdentifier};
  `;

  return result.recordset;
}

async function getSurveyStudentResponses(surveyIdentifier) {
  await sql.connect(msConfig);
  const result = await sql.query`
    select 
      SurveyIdentifier,
      StudentUSI,
      CreateDate
    from
      edfi.SurveyResponse
    where
      SurveyIdentifier = ${surveyIdentifier}
      and SurveyResponse.StudentUSI is not null;
  `;

  return result.recordset;
}

async function getSurveyStudentResponseAnswers(surveyIdentifier) {
  await sql.connect(msConfig);
  const result = await sql.query`
    select
      SurveyQuestion.SurveyIdentifier,
      SurveyQuestion.QuestionCode,
      SurveyResponse.StudentUSI,
      SurveyQuestionResponseValue.TextResponse
    from
      edfi.SurveyQuestion
      inner join
        edfi.SurveyQuestionResponse
          on SurveyQuestion.SurveyIdentifier = SurveyQuestionResponse.SurveyIdentifier
            and SurveyQuestion.QuestionCode = SurveyQuestionResponse.QuestionCode 
            and SurveyQuestion.SurveyIdentifier = SurveyQuestionResponse.SurveyIdentifier
      inner join
        edfi.SurveyResponse
          on SurveyQuestionResponse.SurveyIdentifier = SurveyResponse.SurveyIdentifier
            and SurveyQuestionResponse.SurveyResponseIdentifier = SurveyResponse.SurveyResponseIdentifier
      inner join
        edfi.SurveyQuestionResponseValue
          on SurveyResponse.SurveyIdentifier = SurveyQuestionResponseValue.SurveyIdentifier
            and SurveyResponse.SurveyResponseIdentifier = SurveyQuestionResponseValue.SurveyResponseIdentifier 
            and SurveyQuestion.QuestionCode = SurveyQuestionResponseValue.QuestionCode
    where
      SurveyResponse.StudentUSI is not null 
        and SurveyQuestion.SurveyIdentifier = ${surveyIdentifier}
        and SurveyQuestionResponseValue.TextResponse is not null;
  `;

  return result.recordset;
}

async function getStudentSchoolKeysFromStudentUSIs(surveykey, odsSurveyStudentResponses) {
  const surveyStudentResponses = [];
  const params = [];

  const studentUSIList = odsSurveyStudentResponses.map((studResponse) => studResponse.StudentUSI);

  for (let i = 1; i <= studentUSIList.length; i += 1) {
    params.push(`$${i}`);
  }

  await sql.connect(msConfig);

  const students = await sql.query(`
    SELECT
      CONCAT(Student.StudentUniqueId, '-', StudentSchoolAssociation.SchoolId) AS StudentSchoolKey,
      Student.StudentUniqueId AS StudentKey,
      CAST(StudentSchoolAssociation.SchoolId AS VARCHAR) AS SchoolKey,
      Student.StudentUSI
    FROM
      edfi.Student
    INNER JOIN
      edfi.StudentSchoolAssociation ON
        Student.StudentUSI = StudentSchoolAssociation.StudentUSI
    INNER JOIN
      edfi.Descriptor ON
        StudentSchoolAssociation.EntryGradeLevelDescriptorId = Descriptor.DescriptorId
    INNER JOIN
      edfi.School ON
        StudentSchoolAssociation.SchoolId = School.SchoolId
    WHERE
      Student.StudentUSI IN (${studentUSIList.join(',')}) AND (
        StudentSchoolAssociation.ExitWithdrawDate IS NULL
        OR StudentSchoolAssociation.ExitWithdrawDate >= GETDATE())
    `)
    .then((result) => result.recordset)
    .catch((err) => {
      console.error(`ERROR: ${err} - ${err.detail}`);
    });

  odsSurveyStudentResponses.forEach((studentResponse) => {
    const student = students.find((stud) => stud.StudentUSI === studentResponse.StudentUSI);

    if (student) {
      surveyStudentResponses.push({
        surveykey,
        studentschoolkey: student.StudentSchoolKey,
        StudentKey: student.StudentKey,
        StudentUSI: studentResponse.StudentUSI,
        date: new Date(),
      });
    }
  });

  return surveyStudentResponses;
}

async function saveSurvey(odsSurvey, db) {
  return db.query(
    `
      INSERT INTO buzz.survey (title,odssurveyidentifier)
        VALUES ($1,$2) RETURNING surveykey
      `,
    [odsSurvey.SurveyTitle, odsSurvey.SurveyIdentifier],
  )
    .then((result) => ({
      odsSurveyIdentifier: odsSurvey.SurveyIdentifier,
      surveykey: result.rows[0].surveykey,
      title: odsSurvey.SurveyTitle,
      staffkey: null,
    }))
    .catch((err) => {
      console.error(`ERROR: ${err} - ${err.detail}`);
    });
}

async function saveSurveyQuestions(odsSurveyQuestions, buzzSurveyKey, db) {
  const surveyQuestions = [];

  async function save(question) {
    return db.query(
      `
        INSERT INTO buzz.surveyquestion(surveykey,question)
          VALUES ($1, $2) RETURNING surveyquestionkey
        `,
      [
        buzzSurveyKey,
        question.QuestionText,
      ],
    )
      .then((result) => result.rows[0].surveyquestionkey)
      .catch((err) => {
        console.error(`ERROR: ${err} - ${err.detail}`);
      });
  }

  for (let i = 0; i < odsSurveyQuestions.length; i += 1) {
    const question = odsSurveyQuestions[i];

    /* eslint-disable-next-line no-await-in-loop */
    const surveyquestionkey = await save(question);

    surveyQuestions.push({
      surveyquestionkey,
      surveykey: buzzSurveyKey,
      question: question.QuestionText,
      odsSurveyIdentifier: question.SurveyIdentifier,
      QuestionCode: question.QuestionCode,
    });
  }

  return surveyQuestions;
}

async function saveSurveyResponses(surveyResponses, db) {
  const studentsurveys = [];

  async function save(surveyResponse) {
    return db.query(
      `
        INSERT INTO buzz.studentsurvey(surveykey,studentschoolkey,date)
          VALUES ($1,$2,$3) RETURNING studentsurveykey
        `,
      [
        surveyResponse.surveykey,
        surveyResponse.studentschoolkey,
        surveyResponse.date,
      ],
    )
      .then((result) => result.rows[0].studentsurveykey)
      .catch((err) => {
        console.error(`ERROR: ${err} - ${err.detail}`);
      });
  }

  for (let i = 0; i < surveyResponses.length; i += 1) {
    const surveyResponse = surveyResponses[i];

    /* eslint-disable-next-line no-await-in-loop */
    const studentsurveykey = await save(surveyResponse, db);

    surveyResponse.studentsurveykey = studentsurveykey;

    studentsurveys.push(surveyResponse);
  }

  return studentsurveys;
}

async function saveSurveyResponsesAnswers(
  surveyResponseAnswers, surveyResponses, surveyQuestions, db,
) {
  const studentSurveyAnswers = [];
  async function save(surveyResponseAnswer, studentsurveykey, surveyquestionkey) {
    return db.query(
      `
        INSERT INTO buzz.studentsurveyanswer(studentsurveykey, surveyquestionkey, answer)
          VALUES ($1,$2,$3) RETURNING studentsurveyanswerkey
        `,
      [
        studentsurveykey,
        surveyquestionkey,
        surveyResponseAnswer.TextResponse,
      ],
    )
      .then((result) => result.rows[0].studentsurveyanswerkey)
      .catch((err) => {
        console.error(`ERROR: ${err} - ${err.detail}`);
      });
  }

  for (let i = 0; i < surveyResponseAnswers.length; i += 1) {
    const surveyResponseAnswer = surveyResponseAnswers[i];

    const studentsurvey = surveyResponses.find(
      (surveyResponse) => surveyResponseAnswer.StudentUSI === surveyResponse.StudentUSI,
    );

    const surveyQuestion = surveyQuestions.find(
      (survQuestion) => surveyResponseAnswer.QuestionCode === survQuestion.QuestionCode,
    );

    /* eslint-disable-next-line no-await-in-loop */
    const studentsurveykey = await save(
      surveyResponseAnswer, studentsurvey.studentsurveykey, surveyQuestion.surveyquestionkey, db,
    );

    surveyResponseAnswer.studentsurveykey = studentsurveykey;

    studentSurveyAnswers.push(surveyResponseAnswer);
  }

  return studentSurveyAnswers;
}

const process = async (surveyIdentifier) => {
  if (await odsDs() !== 'ds5') {
    console.error('The Data Stardard is unknown. Make sure you have ODS version 5.');
    return;
  }

  const db = await getDB();

  console.log(`Getting survey ${surveyIdentifier} from ODS database... `);
  const odsSurvey = await getSurvey(surveyIdentifier);

  if (odsSurvey) {
    console.log(' ... Survey found.');

    await deleteSurveyIfItExists(surveyIdentifier, db);

    console.log('Importing survey... ');
    const survey = await saveSurvey(odsSurvey, db);
    console.log(' ... survey saved.');

    console.log('Importing survey questions... ');
    const surveyQuestions = await saveSurveyQuestions(
      await getSurveyQuestions(surveyIdentifier), survey.surveykey, db,
    );
    console.log(' ... survey questions imported.');

    console.log('Importing survey responses... ');
    let surveyResponses = await getStudentSchoolKeysFromStudentUSIs(
      survey.surveykey, await getSurveyStudentResponses(surveyIdentifier),
    );
    surveyResponses = await saveSurveyResponses(surveyResponses, db);
    console.log(' ... survey responses imported.');

    console.log('Importing survey answers... ');
    await saveSurveyResponsesAnswers(
      await getSurveyStudentResponseAnswers(surveyIdentifier), surveyResponses, surveyQuestions, db,
    );
    console.log(' ... survey answers imported.');
  } else {
    console.error('Survey not found.');
  }
};

exports.process = process;
