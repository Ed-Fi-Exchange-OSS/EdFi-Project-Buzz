// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { TeacherHeaderType } from '../types/TeacherHeaderType';
import { TeacherClassType } from '../types/TeacherClassType';

const sections: Array<TeacherClassType> = [
  {
    sessionname: 'Test',
    localcoursecode: '',
    schoolyear: 2020,
    sectionkey: '1',
  },
  {
    sessionname: 'Test 2',
    localcoursecode: '',
    schoolyear: 2015,
    sectionkey: '2',
  },
];

const TeacherHeaderData: TeacherHeaderType = {
  firstname: 'John',
  lastsurname: 'Doe',
  middlename: '',
  sections,
};

export default TeacherHeaderData;
