// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import gql from 'graphql-tag';

const getStudentsBySection = gql`
query($staffkey: ID!, $sectionKey: String) {
  sectionbystaff(staffkey:$staffkey, sectionkey:$sectionKey) {
    students {
      studentkey,
      studentfirstname,
      studentmiddlename,
      studentlastname,
      gradelevel,
      studentschoolkey,
      contacts {
        contactfirstname,
        contactlastname,
        relationshiptostudent,
        primaryemailaddress,
        phonenumber,
        streetnumbername,
        apartmentroomsuitenumber,
        isprimarycontact,
        preferredcontactmethod,
        besttimetocontact,
        contactnotes,
      },
      siblingscount,
      siblings {
        studentfirstname,
        studentmiddlename,
        studentlastname,
        gradelevel,
        studentschoolkey
      }
    }
  }
}
`;

const getStudentById = gql`
query($staffkey: ID!, $studentschoolkey: String!) {
  studentbystaff(staffkey:$staffkey, studentschoolkey: $studentschoolkey) {
    studentschoolkey,
    studentkey,

    studentfirstname,
    studentmiddlename,
    studentlastname,
    gradelevel,
    pictureurl,

    siblingscount,
    siblings {
      studentfirstname,
      studentmiddlename,
      studentlastname,
      gradelevel,
      studentschoolkey
    },
    notes{
      studentnotekey,
      note,
      staffkey,
      dateadded
    },
    studentsurveys {
      surveykey,
      studentsurveykey,
      survey{
        title
      },
      date,
      answers{
        question,
        answer
      }
    },
    contacts {
      contactfirstname,
      contactlastname,
      relationshiptostudent,
      primaryemailaddress,
      phonenumber,
      streetnumbername,
      apartmentroomsuitenumber,
      isprimarycontact,
      preferredcontactmethod,
      besttimetocontact,
      contactnotes,
    }
  }
}
`;

export { getStudentsBySection, getStudentById };
