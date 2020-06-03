import React, { FunctionComponent, useState, useEffect } from 'react';
import { StudentDetailGuardianType } from './types/StudentDetailGuardianType';
import { StudentDetailType } from './types/StudentDetailTypes';
import StudentGuardianContainer from './StudentGuardianContainer';
import allStudents from "./mockData/mockedStudents";
import ErrorMessage from '../utilities/ErrorMessage';
import { StudentDetailProps } from './StudentDetailProps';

const StudentDetail: FunctionComponent<StudentDetailProps> = ( props ) => {
  const [student, setStudent] = useState<StudentDetailType | undefined>(undefined);

  useEffect(() => {
      debugger
      const query = allStudents;
      let ourStudent = query.filter(student => student.id === props.id)[0];
      setStudent(ourStudent);
  }, [props.id]);

  return student && student !== undefined ? (
    <div className={'studentDetailContainer'}>
      <div className={'studentDetailHeader'}>{`Student Detail - ${student.firstName} ${student.lastName}`}</div>
      <div className={'studentDetailEmail'}>{`${student.email}`}</div>
      <div className={'studentDetailId'}>{`${student.id}`}</div>
      <div id="guardians" className={'studentDetailGuardiansContainer'}>
      { student.guardians.map((value: StudentDetailGuardianType) => (
      <StudentGuardianContainer key={value.id} {...value} />))}
    ))
      </div>
    </div>
  ) : (
    <ErrorMessage message={`There is no student with an ID of '${id}'`} />
  );
};

export default StudentDetail;
