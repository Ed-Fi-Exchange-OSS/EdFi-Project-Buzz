// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import gql from 'graphql-tag';

const getDemographicsCharacteristicsData = gql`
  query($studentschoolkey: String!) {
    studentcharacteristicsbystudentschool (studentschoolkey: $studentschoolkey){
      demographicskey
      shortdescription
      demographicstypekey
    }
  }
`;

const studentprogramsbystudentschool = gql`
  query($studentschoolkey: String!) {
    studentprogramsbystudentschool (studentschoolkey: $studentschoolkey){
      demographicskey
      shortdescription
      demographicstypekey
    }
  }
`;

export { getDemographicsCharacteristicsData, studentprogramsbystudentschool };
