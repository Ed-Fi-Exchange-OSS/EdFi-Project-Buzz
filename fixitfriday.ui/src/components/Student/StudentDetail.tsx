import React, { FunctionComponent } from 'react';
import { StudentDetailGuardianType } from "./types/StudentDetailGuardianType";
import { StudentDetailProps } from './types/StudentDetailProps';
import StudentGuardianContainer from "./StudentGuardianContainer";

const StudentDetail: FunctionComponent<StudentDetailProps> = ({ id, firstName, lastName, email, guardians }) => {
  let guardianDiv = guardians.map((value: StudentDetailGuardianType) => (
    <StudentGuardianContainer key={value.id} {...value} />
  ));

  return (
    <div className={'studentDetailContainer'}>
      <div className={"studentDetailHeader"}>{`Student Detail - ${firstName} ${lastName}`}</div>
      <div className={"studentDetailEmail"}>{`${email}`}</div>
      <div className={"studentDetailId"}>{`${id}`}</div>
      <div id="guardians" className={"studentDetailGuardiansContainer"}>{guardianDiv}</div>
    </div>
  );
};

export default StudentDetail;
