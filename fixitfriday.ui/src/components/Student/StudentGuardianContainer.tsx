import React, { FunctionComponent } from 'react';
import { StudentDetailGuardianType } from './types/StudentDetailGuardianType';

const StudentGuardianContainer: FunctionComponent<StudentDetailGuardianType> = ({ id, firstName, lastName, phone, address }) => {
  return (
    <div className={"studentGuardian"} >
      <div>{`${firstName} ${lastName}`}</div>
      <div>{`${phone}`}</div>
      <div>{`${address}`}</div>
    </div>
  );
};

export default StudentGuardianContainer;
