// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import gql from 'graphql-tag';

const getStaffById = gql`
query($staffkey:ID!){
  staffbyid(staffkey: $staffkey){
    staffkey
    personaltitleprefix
    lastsurname
    firstname
    middlename
    electronicmailaddress
    sections{
      sectionkey
      localcoursecode
      sessionname
      schoolyear
    }
  }
}
`;

const getStaffNameById = gql`
query($staffkey:ID!){
  staffbyid(staffkey: $staffkey){
    staffkey
    personaltitleprefix
    lastsurname
    firstname
    middlename
    electronicmailaddress
  }
}
`;

const getStaffByEMail = gql`
query {
  staffbyemail {
    staffkey
    personaltitleprefix
    lastsurname
    firstname
    middlename
    electronicmailaddress
    sections {
      sectionkey
      localcoursecode
      sessionname
      schoolyear
    }
  }
}
`;




export { getStaffById, getStaffNameById, getStaffByEMail };
