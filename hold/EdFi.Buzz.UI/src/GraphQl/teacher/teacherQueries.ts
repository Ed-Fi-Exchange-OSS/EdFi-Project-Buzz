// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import gql from 'graphql-tag';

const GET_TEACHER_NAME_AND_SECTIONS = gql`
  query($StaffKey: Int) {
    sectionsbystaff(staffkey: $StaffKey) {
      staffkey
      firstname
      middlename
      lastsurname
      sections {
        sectionkey
        localcoursecode
        sessionname
        schoolyear
      }
    }
  }
`;

export default GET_TEACHER_NAME_AND_SECTIONS;
