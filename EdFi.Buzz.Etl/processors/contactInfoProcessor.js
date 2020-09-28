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
      .pipe(csv())
      .on('data', (row) => {
        data.push(row);
      })
      .on('end', () => {
        resolve({ data });
      });
  });
}

async function getContacts(contactPersonKey, db) {
  const uniqContactPersonKeys = [...new Set(contactPersonKey)];
  const params = [];

  for (let i = 1; i <= uniqContactPersonKeys.length; i += 1) {
    params.push(`$${i}`);
  }

  return db.query(`SELECT contactpersonkey,contactfirstname,contactlastname FROM buzz.contactperson WHERE contactpersonkey IN (${params.join(',')})`,
    uniqContactPersonKeys)
    .then((result) => result.rows)
    .catch((err) => {
      console.error(`ERROR: ${err} - ${err.detail}`);
    });
}

async function saveContactInfo(contactToUpdate, db) {
  const promises = [];

  console.log(`   ...Updating ${contactToUpdate.length} contacts`);

  contactToUpdate.forEach((currentContact) => {
    promises.push(
      db.query(
        `
          UPDATE
            buzz.contactperson 
          SET
            preferredcontactmethod = $2, 
            besttimetocontact = $3
          WHERE contactpersonkey = $1;
          `,
        [
          currentContact.ContactPersonKey,
          currentContact.PreferredContactMethod,
          currentContact.BestTimeToContact,
        ],
      )
        .then((result) => {
          if (result.rowCount > 0) {
            console.log(`        (${currentContact.ContactPersonKey}) ${currentContact.contactfirstname} ${currentContact.contactlastname} updated successfully.`);
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

  console.log('\r\nExtract data from the file...');
  const data = await Extract(path.join(filename));

  if (!data.data || data.data.length === 0) {
    console.error('ERROR: No data found in the file.');
    return;
  }
  if (!data.data[0].ContactPersonKey) {
    console.error('ERROR: ContactPersonKey columns was not properly set in the file.');
    return;
  }

  console.log(`   ...${data.data.length} contacts extracted from the file.`);

  console.log('\r\nGet contacts from database, based on data extracted from the file...');
  const dbContacts = await getContacts(data.data.map((contact) => contact.ContactPersonKey), db);

  console.log(`   ...${dbContacts.length} contacts found in the database.`);

  // Find the elements in the file that do not exist in the database.
  /* eslint-disable-next-line max-len */
  const noFoundContacts = data.data.filter((c) => !dbContacts.find((dbC) => dbC.contactpersonkey === c.ContactPersonKey));

  if (noFoundContacts && noFoundContacts.length > 0) {
    if (noFoundContacts.length === 1) {
      console.log('\r\nWARNING: One contact found in the file does not exist in the database. This contact is: ');
      console.log(`  ${noFoundContacts[0].ContactPersonKey}`);
    } else if (noFoundContacts.length > 1) {
      console.log('\r\nWARNING: Some contacts found in the file do not exist in the database. These contacts are: ');
      console.log(`  [${noFoundContacts.map((contact) => contact.ContactPersonKey).join(',')}]`);
    }
  }

  const contactsToUpdate = [];

  data.data.forEach((contact) => {
    /* eslint-disable-next-line max-len */
    const contactToUpdate = dbContacts.find((dbContact) => dbContact.contactpersonkey === contact.ContactPersonKey);
    if (contactToUpdate) {
      contactsToUpdate.push({
        ...contact,
        contactfirstname: contactToUpdate.contactfirstname,
        contactlastname: contactToUpdate.contactlastname,
      });
    }
  });

  console.log('\r\nUpdating contact info...');
  await saveContactInfo(contactsToUpdate, db);

  if (noFoundContacts && noFoundContacts.length > 0) {
    console.warn('... Process finished successfully with a warning.\r\n');
  } else {
    console.log('... Process finished successfully.\r\n');
  }
};

exports.process = process;
