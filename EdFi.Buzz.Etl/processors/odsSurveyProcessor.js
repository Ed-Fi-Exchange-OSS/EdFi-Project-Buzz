// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

//TODO: Validar el DS, tiene que ser 5

/* eslint no-param-reassign: ["error", { "props": false }] */
const dotnet = require('dotenv');

dotnet.config();
const config = require('../config/dbs');
const { Client } = require('pg');
const sql = require('mssql');

const msConfig = config.mssqlConfig;
const pgConfig = config.pgConfig;

async function getDB() {
  const connectionString = `postgres://${pgConfig.user}:${pgConfig.password}@${pgConfig.host}:${pgConfig.port}/${pgConfig.database}`;

  const client = new Client({ connectionString });
  await client.connect().catch((e) => console.error(e));
  return client;
}

async function ods_ds() {
  await sql.connect(msConfig);
  var version = await sql.query`
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
  let surveyStudentResponses = [];
  const params = [];

  const studentUSIList = odsSurveyStudentResponses.map(studentResponse => studentResponse.StudentUSI );
  
  for (let i = 1; i <= studentUSIList.length; i += 1) {
    params.push(`$${i}`);
  }

  await sql.connect(msConfig);

  const result = await sql.query(`
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

  odsSurveyStudentResponses.forEach(studentResponse => {
    const student = result.find(studentSchool => studentSchool.StudentUSI == studentResponse.StudentUSI)

    if (student) {
      surveyStudentResponses.push({
        'surveykey': surveykey,
        'studentschoolkey': student.StudentSchoolKey,
        'StudentKey': student.StudentKey,
        'StudentUSI': studentResponse.StudentUSI,
        'date': new Date()
      });
    }
  });

  return surveyStudentResponses;
}

async function saveSurvey(odsSurvey, db) {
  return db.query(
    `
      INSERT INTO buzz.survey (title)
        VALUES ($1) RETURNING surveykey
      `,
    [odsSurvey.SurveyTitle]
  )
  .then(result => {
    return {
      'odsSurveyIdentifier': odsSurvey.SurveyIdentifier,
      'surveykey': result.rows[0].surveykey,
      'title': odsSurvey.SurveyTitle,
      'staffkey': null
    }
  })
  .catch((err) => {
    console.error(`ERROR: ${err} - ${err.detail}`);
  })
}

async function saveSurveyQuestions (odsSurveyQuestions, buzzSurveyKey, db) {
  let surveyQuestions = [];

  async function save (buzzSurveyKey, question, db) {
    return db.query(
      `
        INSERT INTO buzz.surveyquestion(surveykey,question)
          VALUES ($1, $2) RETURNING surveyquestionkey
        `,
      [
        buzzSurveyKey,
        question.QuestionText
      ]
    )
    .then((result) => result.rows[0].surveyquestionkey)
    .catch((err) => {
      console.error(`ERROR: ${err} - ${err.detail}`);
    })
  };

  for (var i = 0; i < odsSurveyQuestions.length; i ++) {
    const question = odsSurveyQuestions[i];
    const surveyquestionkey = await save(buzzSurveyKey, question, db);

    surveyQuestions.push({
      'surveyquestionkey': surveyquestionkey,
      'surveykey': buzzSurveyKey,
      'question': question.QuestionText,
      'odsSurveyIdentifier': question.SurveyIdentifier,
      'QuestionCode': question.QuestionCode
    });
  }

  return surveyQuestions;
}

async function saveSurveyResponses (surveyResponses, db) {
  let studentsurveys = [];

  async function save(surveyResponse) {
    return db.query(
      `
        INSERT INTO buzz.studentsurvey(surveykey,studentschoolkey,date)
          VALUES ($1,$2,$3) RETURNING studentsurveykey
        `,
      [
        surveyResponse.surveykey,
        surveyResponse.studentschoolkey,
        surveyResponse.date
      ]
    )
    .then((result) => result.rows[0].studentsurveykey)
      .catch((err) => {
        console.error(`ERROR: ${err} - ${err.detail}`);
      })
  }

  for (var i = 0; i < surveyResponses.length; i ++) {
    const surveyResponse = surveyResponses[i];
    const studentsurveykey = await save(surveyResponse, db);
    
    surveyResponse.studentsurveykey = studentsurveykey;

    studentsurveys.push(surveyResponse);
  }

  return studentsurveys;
}

async function saveSurveyResponsesAnswers (surveyResponseAnswers, surveyResponses, surveyQuestions, db) {
  let studentSurveyAnswers = [];
  async function save(surveyResponseAnswer, studentsurveykey, surveyquestionkey) {
    return db.query(
      `
        INSERT INTO buzz.studentsurveyanswer(studentsurveykey, surveyquestionkey, answer)
          VALUES ($1,$2,$3) RETURNING studentsurveyanswerkey
        `,
      [
        studentsurveykey,
        surveyquestionkey,
        surveyResponseAnswer.TextResponse
      ]
    )
    .then((result) => result.rows[0].studentsurveyanswerkey)
      .catch((err) => {
        console.error(`ERROR: ${err} - ${err.detail}`);
      })
  }

  for (var i = 0; i < surveyResponseAnswers.length; i ++) {
    const surveyResponseAnswer = surveyResponseAnswers[i];

    const studentsurvey = surveyResponses.find(
      surveyResponse => surveyResponseAnswer.StudentUSI === surveyResponse.StudentUSI);

    const surveyQuestion = surveyQuestions.find(
      surveyQuestion => surveyResponseAnswer.QuestionCode === surveyQuestion.QuestionCode);
  
    const studentsurveykey = await save(surveyResponseAnswer, studentsurvey.studentsurveykey, surveyQuestion.surveyquestionkey, db);
    
    surveyResponseAnswer.studentsurveykey = studentsurveykey;
    
    studentSurveyAnswers.push(surveyResponseAnswer);
  }

  return studentSurveyAnswers;
}



const process = async (surveyIdentifier) => {

  if (await ods_ds() !== 'ds5') {
    console.error('The Data Stardard is unknown. Make sure you have ODS version 5.');
    return;
  }

  const db = await getDB();

  const odsSurvey = await getSurvey(surveyIdentifier);

  if (odsSurvey) {
    const survey = await saveSurvey(odsSurvey, db);
    
    // console.log('survey: ');
    // console.log(survey);
    
    const surveyQuestions = await saveSurveyQuestions(await getSurveyQuestions(survey.odsSurveyIdentifier), survey.surveykey, db);

    // console.log('surveyQuestions: ');
    // console.log(surveyQuestions);

    let surveyResponses = await getStudentSchoolKeysFromStudentUSIs(survey.surveykey, await getSurveyStudentResponses(survey.odsSurveyIdentifier));

    // console.log('surveyResponses: ');
    // console.log(surveyResponses);
    
    surveyResponses = await saveSurveyResponses(surveyResponses, db);
    
    // console.log('surveyResponses: ');
    // console.log(surveyResponses);

    const surveyResponsesAnswers = await saveSurveyResponsesAnswers (await getSurveyStudentResponseAnswers(survey.odsSurveyIdentifier), surveyResponses, surveyQuestions, db)

    // console.log('surveyResponsesAnswers: ');
    // console.log(surveyResponsesAnswers);
  }
};

exports.process = process;
