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
const { v4: uuidv4 } = require('uuid');
const { Client } = require('pg');
const { pgConfig } = require('../config/dbs');

async function getDB() {
  const connectionString = `postgres://${pgConfig.user}:${pgConfig.password}@${pgConfig.host}:${pgConfig.port}/${pgConfig.database}`;

  const client = new Client({ connectionString });
  await client.connect().catch((e) => console.error(e));
  return client;
}

async function Extract(fileName) {
  const data = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(fileName)
      .on('error', (err) => {
        reject(err)
      })
      .pipe(csv({ separator: '\t' }))
      .on('data', (row) => {
        data.push(row)
      })
      .on('end', () => {
        resolve({ data });
      });
  });
}

async function getStudents(studentKeys, db) {
  let uniqStudentKeys = [...new Set(studentKeys)];
  let params = [];

  for(var i = 1; i <= uniqStudentKeys.length; i++) {
    params.push('$' + i);
  }

  return db.query('SELECT studentkey, studentschoolkey FROM buzz.studentschool WHERE studentkey IN (' + params.join(',') + ')'
    ,uniqStudentKeys)
  .then((result) => {
    result.rows
  })
  .catch((err) => {
    console.error(`ERROR: ${err} - ${err.detail}`);
  });
}

async function saveContactData(allContactsData, students, db) {
  const promises = [];
  allContactsData.forEach(currentContactData => {
    let newGuid = uuidv4();
    promises.push(
      db.query(
          `
          INSERT INTO buzz.contactperson(uniquekey,contactpersonkey,studentkey,contactfirstname,contactlastname
            ,relationshiptostudent,contactaddress,phonenumber,primaryemailaddress) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          `,
          [
            `${newGuid}-${currentContactData['STUDENTS.Student_Number']}`,
            newGuid, 
            currentContactData['STUDENTS.Student_Number'],
            currentContactData['STUDENTCOREFIELDS.guardian_fn'],
            currentContactData['STUDENTCOREFIELDS.guardian_ln'],
            'Unknown',
            `${currentContactData['STUDENTS.Street']} ${currentContactData['STUDENTS.City']}, ${currentContactData['STUDENTS.State']} ${currentContactData['STUDENTS.Zip']}`,
            currentContactData['U_DEF_EXT_STUDENTS.parent1_primaryphone'],
            currentContactData['U_DEF_EXT_STUDENTS.parent1_email'],
          ],
        )
        .then((result) => {
          if (result.rowCount > 0) {
            console.log('Nice!');
            let studentschoolkey = students.find(student => {
              return student.studentkey === currentContactData['STUDENTS.Student_Number'];
            });

            db.query(
              `
              INSERT INTO buzz.studentcontact (contactkey, studentschoolkey) VALUES ($1, $2)
              `,
              [currentContactData['STUDENTS.Student_Number'], studentschoolkey]
            )
            .then((result) => {
              if (result.rowCount > 0) {
                console.log('Nice2!');
              } else {
                console.log('Error2!');
              }
            })
          } else {
            console.log('Error!');
          }
        })
    );
  });
  
  return Promise.allSettled(promises);
}

const process = async (filename) => {
    const db = await getDB();
    
    const data = await Extract(path.join(filename));

    let students = await getStudents(data.data.map(contact => {
      return contact['STUDENTS.Student_Number'];
    }), db);

    await saveContactData(data.data, students, db);
  };
  
  exports.process = process;
  