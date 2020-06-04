import React, { FunctionComponent } from 'react';
import { StudentDetailGuardianType } from './types/StudentDetailGuardianType';
import { Card, Col } from 'react-bootstrap';
import ProfilePic from '../utilities/ProfilePic';

const StudentGuardianContainer: FunctionComponent<StudentDetailGuardianType> = ({
  id,
  firstName,
  lastName,
  phone,
  address,
  pictureurl,
}) => {
  return (
    <Card
      key={id}
      style={{
        flex: '1',
        border: '1px solid #696969',
        minWidth: '18rem',
        maxWidth: '18rem',
        padding: '5px 5px',
        margin: '10px 10px',
      }}
    >
      <Card.Body style={{ display: 'flex' }}>
        <div style={{ flex: 3 }}>
          <Card.Title>{`${firstName} ${lastName}`}</Card.Title>
          <Card.Subtitle>Relationship</Card.Subtitle>
          <Card.Text>{`${phone}`}</Card.Text>
          <Card.Text>{`${address}`}</Card.Text>
        </div>
        <div
          style={{
            flex: 1,
            margin: '2px 2em 2px 2px',
            minWidth: '70px',
          }}
        >
          <ProfilePic pictureUrl={pictureurl} />
        </div>
      </Card.Body>
    </Card>
  );
};

export default StudentGuardianContainer;
