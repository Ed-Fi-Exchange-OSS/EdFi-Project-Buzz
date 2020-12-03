/*
 * SPDX-License-Identifier: Apache-2.0
 * Licensed to the Ed-Fi Alliance under one or more agreements.
 * The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
 * See the LICENSE and NOTICES files in the project root for more information.
 */

import * as React from 'react';
import { FunctionComponent, useState } from 'react';
import styled from 'styled-components';
import { DataTable , ColumnOption } from '../../Components/DataTable/dataTable';
import { Assessment } from '../../Models';

interface StudentDetailAssessmentProps {
   assessment?: Assessment[];
}

export const StudentDetailAssessment: FunctionComponent<StudentDetailAssessmentProps> = (
  props: StudentDetailAssessmentProps
) => {

  const [columns] = useState(['Assessment','Date Taken','Score']);

  const assessmentDataset
    = props.assessment
    ? props.assessment.map((student) =>
    [student.assessmenttitle, (new Date(student.datetaken)).toLocaleDateString(), student.score]
    )
    : null;

  return (
    <>
    <DataTable
      columns={columns}
      dataSet={assessmentDataset}
      linkBaseURL={''}
      defaultSort={1}
      alwaysSortLastByColumn={1}
      key={32}
    />
    </>
  );
};
