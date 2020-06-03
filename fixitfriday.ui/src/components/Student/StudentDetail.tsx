import React, { FunctionComponent } from 'react';

type StudentDetailGuardian = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
};

type StudentDetailProps = {
  id: string;
  firstName: string;
  lastName: string;
  middleName: string;
  pictureurl: string;
  email: string;
  guardians: Array<StudentDetailGuardian>;
};

const StudentDetail: FunctionComponent<StudentDetailProps> = ({ id, firstName, lastName, middleName, email, guardians }) => {
  let guardianDiv = guardians.map((value : StudentDetailGuardian) => (
    <div key={value.id}>
      <div>{`${value.firstName} ${value.lastName}`}</div>
      <div>{`${value.phone}`}</div>
      <div>{`${value.address}`}</div>
    </div>));

  return (
    <div>
      <div>{`Student Detail - ${firstName} ${lastName}`}</div>
      <div>{`${email}`}</div>
      <div>{`${id}`}</div>
      <div id="guardians">{guardianDiv}</div>
    </div>
  );
};

export default StudentDetail;
