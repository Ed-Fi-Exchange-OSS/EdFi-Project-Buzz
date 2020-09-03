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

const studentNumber = 'STUDENTS.Student_Number';
const contactfirstname = 'STUDENTCOREFIELDS.guardian_fn';
const contactlastname = 'STUDENTCOREFIELDS.guardian_ln';
const contactStreet = 'STUDENTS.Street';
const contactCity = 'STUDENTS.City';
const contactState = 'STUDENTS.State';
const contactZip = 'STUDENTS.Zip';
const contactphone = 'U_DEF_EXT_STUDENTS.parent1_primaryphone';
const contactemail = 'U_DEF_EXT_STUDENTS.parent1_email';

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
        reject(err);
      })
      .pipe(csv({ separator: '\t' }))
      .on('data', (row) => {
        data.push(row);
      })
      .on('end', () => {
        resolve({ data });
      });
  });
}

async function getStudents(studentKeys, db) {
  const uniqStudentKeys = [...new Set(studentKeys)];
  const params = [];

  for (let i = 1; i <= uniqStudentKeys.length; i += 1) {
    params.push(`$${i}`);
  }

  return db.query(`SELECT studentkey, studentschoolkey FROM buzz.studentschool WHERE studentkey IN (${params.join(',')})`,
    uniqStudentKeys)
    .then((result) => result.rows)
    .catch((err) => {
      console.error(`ERROR: ${err} - ${err.detail}`);
    });
}

async function getStudentContacts(students, db) {
  const studentKeys = students.map((student) => student.studentkey);

  const uniqStudentKeys = [...new Set(studentKeys)];
  const params = [];

  for (let i = 1; i <= uniqStudentKeys.length; i += 1) {
    params.push(`$${i}`);
  }

  return db.query(`SELECT uniquekey as contactkey, studentkey, contactfirstname, contactlastname FROM buzz.contactperson WHERE studentkey IN (${params.join(',')})`,
    uniqStudentKeys)
    .then((result) => result.rows)
    .catch((err) => {
      console.error(`ERROR: ${err} - ${err.detail}`);
    });
}

function matchFileContactsWithExistingContactsinDB(fileData, contacts) {
  let newContacts = 0;
  let editContacts = 0;

  fileData.forEach((fileCon) => {
    const contactFound = contacts.find((contact) => contact.studentkey === fileCon[studentNumber]
        && contact.contactfirstname === fileCon[contactfirstname]
        && contact.contactlastname === fileCon[contactlastname]);

    if (contactFound) {
      fileCon.contactkey = contactFound.contactkey;
      editContacts += 1;
    } else {
      fileCon.contactkey = null;
      newContacts += 1;
    }
  });

  return {
    newContacts, editContacts,
  };
}

async function saveContactData(allContactsData, students, db) {
  const newContactsData = allContactsData.filter((contactData) => contactData.contactkey == null);

  const editContactsData = allContactsData.filter((contactData) => contactData.contactkey != null);

  console.log(`   ...Inserting ${newContactsData.length} contacts`);

  const promises = [];
  newContactsData.forEach((currentContact) => {
    const newGuid = uuidv4();

    promises.push(
      db.query(
        `
          INSERT INTO buzz.contactperson(uniquekey,contactpersonkey,studentkey,contactfirstname,contactlastname
            ,relationshiptostudent,contactaddress,phonenumber,primaryemailaddress) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          `,
        [
          `${newGuid}-${currentContact[studentNumber]}`,
          newGuid,
          currentContact[studentNumber],
          currentContact[contactfirstname],
          currentContact[contactlastname],
          'Unknown',
          `${currentContact[contactStreet]} ${currentContact[contactCity]}, ${currentContact[contactState]} ${currentContact[contactZip]}`,
          currentContact[contactphone],
          currentContact[contactemail],
        ],
      )
        .then((result) => {
          if (result.rowCount > 0) {
            console.log(`      ${currentContact[contactfirstname]} ${currentContact[contactlastname]} inserted successfully.`);

            // eslint-disable-next-line max-len
            const { studentschoolkey } = students.find((s) => s.studentkey === currentContact[studentNumber]);

            db.query(
              `
              INSERT INTO buzz.studentcontact (contactkey, studentschoolkey) VALUES ($1, $2)
              `,
              [`${newGuid}-${currentContact[studentNumber]}`, studentschoolkey],
            )
              .then((resultAssoc) => {
                if (resultAssoc.rowCount > 0) {
                  console.log(`      ${currentContact[contactfirstname]} ${currentContact[contactlastname]} associated to student successfully.`);
                }
              })
              .catch((err) => {
                console.error(`ERROR: ${err} - ${err.detail}`);
              });
          }
        })
        .catch((err) => {
          console.error(`ERROR: ${err} - ${err.detail}`);
        }),
    );
  });

  console.log(`   ...Updating ${editContactsData.length} contacts`);

  editContactsData.forEach((currentContact) => {
    promises.push(
      db.query(
        `
          UPDATE buzz.contactperson SET
            relationshiptostudent = $2,
            contactaddress = $3,
            phonenumber = $4,
            primaryemailaddress = $5 
          WHERE uniquekey = $1;
          `,
        [
          currentContact.contactkey,
          'Unknown',
          `${currentContact[contactStreet]} ${currentContact[contactCity]}, ${currentContact[contactState]} ${currentContact[contactZip]}`,
          currentContact[contactphone],
          currentContact[contactemail],
        ],
      )
        .then((result) => {
          if (result.rowCount > 0) {
            console.log(`      ${currentContact[contactfirstname]} ${currentContact[contactlastname]} updated successfully.`);
          }
        })
        .catch((err) => {
          console.error(`ERROR: ${err} - ${err.detail}`);
        }),
    );
  });

  return Promise.allSettled(promises);
}

const process = async (filename) => {
  const db = await getDB();

  console.log('Extract data from the file...');
  const data = await Extract(path.join(filename));

  console.log(`   ...${data.data.length} contacts extracted from the file.`);

  console.log('Get studentkey and studentschoolkey from database, based on data extracted from the file...');
  const students = await getStudents(data.data.map((contact) => contact['STUDENTS.Student_Number']), db);

  console.log(`   ...${students.length} students found in the database.`);

  console.log('Get student contacts based on the student found...');
  const studentContacts = await getStudentContacts(students, db);

  console.log(`   ...${studentContacts.length} contacts found in the database.`);

  console.log('Check if the contact already exists. If it does, then add the contactkey to the file contact row...');
  const match = matchFileContactsWithExistingContactsinDB(data.data, studentContacts);

  console.log(`   ...Based on previous data collected. We have ${match.newContacts} new contacts to insert, and ${match.editContacts} contacts to update.`);

  console.log('Insert or update contact info...');
  await saveContactData(data.data, students, db);
};

exports.process = process;
