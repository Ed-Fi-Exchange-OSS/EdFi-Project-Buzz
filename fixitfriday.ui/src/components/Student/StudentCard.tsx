import React, { FunctionComponent } from 'react';
import { Card } from 'react-bootstrap';
import { StudentCardProps } from './types/StudentCardProps';
import ProfilePic from '../utilities/ProfilePic';

const StudentCard: FunctionComponent<StudentCardProps> = ({
  studentFirstName,
  studentLastName,
  studentSchoolKey,
  email,
  pictureurl,
}) => {
  return (
    <Card
      key={studentSchoolKey}
      style={{
        flex: '1',
        border: '1px solid #696969',
        minWidth: '21rem',
        maxWidth: '21rem',
        padding: '5px 5px',
        margin: '10px 10px',
      }}
    >
      <Card.Body style={{ display: 'flex' }}>
        <div
          style={{
            flex: 1,
            margin: '2px 2em 2px 2px',
            minWidth: '70px',
          }}
        >
          <ProfilePic firstname={studentFirstName} lastname={studentLastName} pictureUrl={pictureurl} />
        </div>
        <div style={{ flex: 4 }}>
          <div style={{ fontWeight: 'bold' }}>{`${studentFirstName} ${studentLastName}`}</div>
          <div>Student ID: {studentSchoolKey}</div>
          <div>{email}</div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default StudentCard;
