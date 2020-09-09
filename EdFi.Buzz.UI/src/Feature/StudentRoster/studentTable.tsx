// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import * as React from 'react';
import { Student } from '../../Models/Student';

import './studentTable.css';

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
          <th> </th>
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
            <a href='mailto:{{student.email}}'>{student.primaryemailaddress}</a>
          </td>

          {student.contacts && student.contacts?.length > 0 &&
            <td>
              {student.contacts[0].contactlastname} {student.contacts[0].contactfirstname}
                ({student.contacts[0].relationshiptostudent})<br />
              Preferred Contact Method: {student.contacts[0].relationshiptostudent} <br />
              <a href='tel:{{student.guardians[0].phone}}'>{student.contacts[0].phonenumber}</a>
            </td>
          } else {
            <td></td>
          }

          <td className='text-center'>
            <a className='btn btn-outline-mail table-btn-outline' tooltip-placement='bottom'>
              <i className='ion ion-md-mail'></i>
              <div className='bubble-counter blue'>5</div>
            </a>
            <a className='btn btn-outline-notifications table-btn-outline'>
              <i className='ion ion-md-notifications-outline'></i>
              <div className='bubble-counter orange'>12</div>
            </a>
          </td>
        </tr>)}
      </tbody>
    </table>
  );
};
