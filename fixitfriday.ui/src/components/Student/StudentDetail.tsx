import React, { FunctionComponent, useState, useEffect } from 'react';
import { StudentDetailGuardianType } from './types/StudentDetailGuardianType';
import { StudentDetailType } from './types/StudentDetailTypes';
import StudentGuardianContainer from './StudentGuardianContainer';
import allStudents from './mockData/mockedStudents';
import ErrorMessage from '../utilities/ErrorMessage';
import { StudentDetailProps } from './StudentDetailProps';

const StudentDetail: FunctionComponent<StudentDetailProps> = ({ match }) => {
  const [student, setStudent] = useState<StudentDetailType | undefined>(undefined);

  useEffect(() => {
    const ourStudent = allStudents.filter((s) => s.id === match.params.id)[0];
    setStudent(ourStudent);
  }, [match.params.id]);

  return student && student !== undefined ? (
    <div className="studentDetailContainer">
      <div className="studentDetailHeader">{`Student Detail - ${student.firstName} ${student.lastName}`}</div>
      <div className="studentDetailEmail">{`${student.email}`}</div>
      <div className="studentDetailId">{`${student.id}`}</div>
      <div id="guardians" className="studentDetailGuardiansContainer">
        {student.guardians.map((value: StudentDetailGuardianType) => (
          <StudentGuardianContainer
            key={value.id}
            id={value.id}
            firstName={value.firstName}
            lastName={value.lastName}
            phone={value.phone}
            address={value.address}
          />
        ))}
        ))
      </div>
    </div>
  ) : (
    <ErrorMessage message={`There is no student with an ID of '${match.params.id}'`} />
  );
};

export default StudentDetail;
