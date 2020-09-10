// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import * as React from 'react';
import Student from '../../Models/Student';

export interface StudentTableComponentProps {
  studentList: Student[];
}

export const StudentTable: React.FunctionComponent<StudentTableComponentProps> = (props: StudentTableComponentProps) => {
  const {studentList} = props;

  return (
    <table className='table table-bordered table-striped verticle-middle'>
      <thead>
        <tr>
          <th>Student Name</th>
          <th style={{ 'marginLeft': '2em' }}>Student Email</th>
          <th>Primary Contact</th>
        </tr>
      </thead>
      <tbody>
        {studentList.map(student => <tr key={student.studentschoolkey}>
          <td>
            <img src={student.pictureurl} alt='{student.name} Profile Picture' className='image-round'
              style={{ 'width': '32px' }} />
            <a href={`#/app/studentDetail/${student.studentschoolkey}`}>
                &nbsp;{student.name}
            </a>
            <br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{student.studentkey}
          </td>
          <td>
            <a href={`mailto:${student.primaryemailaddress}`}>{student.primaryemailaddress}</a>
          </td>

          {student.contacts && student.contacts?.length > 0 &&
            <td>
              {student.contacts[0].contactlastname} {student.contacts[0].contactfirstname}
                ({student.contacts[0].relationshiptostudent})<br />
              Preferred Contact Method: {student.contacts[0].relationshiptostudent} <br />
              <a href={`tel:${student.contacts[0].phonenumber}`}>{student.contacts[0].phonenumber}</a>
            </td>
          }
        </tr>)}
      </tbody>
    </table>
  );
};
