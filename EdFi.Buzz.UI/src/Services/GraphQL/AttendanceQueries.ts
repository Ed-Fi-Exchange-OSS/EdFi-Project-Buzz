// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import gql from 'graphql-tag';

const getAttendanceData = gql`

query($studentschoolkey: String!) {
    attendancebystudentschool  (studentschoolkey: $studentschoolkey){
       studentschoolkey
       reportedaspresentatschool
       reportedasabsentfromschool
       reportedaspresentathomeroom
       reportedasabsentfromhomeroom
       reportedasispresentinallsections
       reportedasabsentfromanysection
   }
 }
`;

export { getAttendanceData };
