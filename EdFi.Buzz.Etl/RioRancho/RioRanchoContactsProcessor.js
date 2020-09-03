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
const { Console } = require('console');

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
      return result.rows;
    })
    .catch((err) => {
      console.error(`ERROR: ${err} - ${err.detail}`);
    });
}

async function getStudentContacts(students, db) {
  let studentKeys = students.map(student => {
    return student.studentkey;
  });

  let uniqStudentKeys = [...new Set(studentKeys)];
  let params = [];

  for(var i = 1; i <= uniqStudentKeys.length; i++) {
    params.push('$' + i);
  }

  return db.query('SELECT uniquekey as contactkey, studentkey, contactfirstname, contactlastname FROM buzz.contactperson WHERE studentkey IN (' + params.join(',') + ')'
      ,uniqStudentKeys)
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.error(`ERROR: ${err} - ${err.detail}`);
    });
}

function matchFileContactsWithExistingContactsinDB(fileData, contacts) {
  let newContacts = 0;
  let editContacts = 0;

  fileData.forEach(fileContact => {
    let contactFound = contacts.find(contact => {
      return contact.studentkey === fileContact[studentNumber]
        && contact.contactfirstname === fileContact[contactfirstname]
        && contact.contactlastname === fileContact[contactlastname]
    });

    if (contactFound) {
      fileContact.contactkey = contactFound.contactkey;
      editContacts++;
    }
    else {
      fileContact.contactkey = null;
      newContacts++;
    }
  });

  return {
    newContacts, editContacts
  };
}

async function saveContactData(allContactsData, students, db) {

  let newContactsData = allContactsData.filter(contactData => {
    return contactData.contactkey == null;
  });

  let editContactsData = allContactsData.filter(contactData => {
    return contactData.contactkey != null;
  });

  console.log(`   ...Inserting ${newContactsData.length} contacts`);

  const promises = [];
  newContactsData.forEach(currentContactData => {
    
    let newGuid = uuidv4();

    promises.push(
      db.query(
          `
          INSERT INTO buzz.contactperson(uniquekey,contactpersonkey,studentkey,contactfirstname,contactlastname
            ,relationshiptostudent,contactaddress,phonenumber,primaryemailaddress) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          `,
          [
            `${newGuid}-${currentContactData[studentNumber]}`,
            newGuid, 
            currentContactData[studentNumber],
            currentContactData[contactfirstname],
            currentContactData[contactlastname],
            'Unknown',
            `${currentContactData[contactStreet]} ${currentContactData[contactCity]}, ${currentContactData[contactState]} ${currentContactData[contactZip]}`,
            currentContactData[contactphone],
            currentContactData[contactemail],
          ]
        )
        .then((result) => {
          if (result.rowCount > 0) {
            console.log(`      ${currentContactData[contactfirstname]} ${currentContactData[contactlastname]} inserted successfully.`);

            let studentschoolkey = students.find(student => {
              return student.studentkey === currentContactData[studentNumber];
            }).studentschoolkey;

            db.query(
              `
              INSERT INTO buzz.studentcontact (contactkey, studentschoolkey) VALUES ($1, $2)
              `,
              [`${newGuid}-${currentContactData[studentNumber]}`, studentschoolkey]
            )
            .then((result) => {
              if (result.rowCount > 0) {
                console.log(`      ${currentContactData[contactfirstname]} ${currentContactData[contactlastname]} associated to student successfully.`);
              }
            })
            .catch((err) => {
              console.error(`ERROR: ${err} - ${err.detail}`);
            })
          }
        })
        .catch((err) => {
          console.error(`ERROR: ${err} - ${err.detail}`);
        })
    );
  });
  
  console.log(`   ...Updating ${editContactsData.length} contacts`);

  editContactsData.forEach(currentContactData => {
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
            currentContactData.contactkey,
            'Unknown',
            `${currentContactData[contactStreet]} ${currentContactData[contactCity]}, ${currentContactData[contactState]} ${currentContactData[contactZip]}`,
            currentContactData[contactphone],
            currentContactData[contactemail],
          ]
        )
        .then((result) => {
          if (result.rowCount > 0) {
            console.log(`      ${currentContactData[contactfirstname]} ${currentContactData[contactlastname]} updated successfully.`);
          }
        })
        .catch((err) => {
          console.error(`ERROR: ${err} - ${err.detail}`);
        })
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
  const students = await getStudents(data.data.map(contact => {
    return contact['STUDENTS.Student_Number'];
  }), db);

  console.log(`   ...${students.length} students found in the database.`);

  console.log('Get student contacts based on the student found...');
  const studentContacts = await getStudentContacts(students, db);

  console.log(`   ...${studentContacts.length} contacts found in the database.`);

  console.log('Check if the contact already exists. If it does, then add the contactkey to the file contact row...');
  let match = matchFileContactsWithExistingContactsinDB(data.data, studentContacts);

  console.log(`   ...Based on previous data collected. We have ${match.newContacts} new contacts to insert, and ${match.editContacts} contacts to update.`);

  console.log('Insert or update contact info...');
  await saveContactData(data.data, students, db);
};

exports.process = process;
