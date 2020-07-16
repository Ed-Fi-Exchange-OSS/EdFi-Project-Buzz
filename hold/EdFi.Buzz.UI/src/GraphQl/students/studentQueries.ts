// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import gql from 'graphql-tag';

const GET_STUDENTS_FOR_SECTION = gql`
  query StudentsBySection($key: String) {
    studentsbysection(sectionkey: $key) {
      student {
        studentschoolkey
        studentfirstname
        studentmiddlename
        studentlastname
        pictureurl
      }
    }
  }
`;

export default GET_STUDENTS_FOR_SECTION;
