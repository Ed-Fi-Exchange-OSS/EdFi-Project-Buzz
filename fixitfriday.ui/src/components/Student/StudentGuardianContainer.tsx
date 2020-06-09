import React, { FunctionComponent } from 'react';
import { Card, Row } from 'react-bootstrap';
import { StudentDetailGuardianType } from './types/StudentDetailGuardianType';
import ProfilePic from '../utilities/ProfilePic';

const StudentGuardianContainer: FunctionComponent<StudentDetailGuardianType> = ({
  id,
  firstName,
  lastName,
  phone,
  address,
  pictureurl,
  relationship,
  isPrimary,
}) => {
  return (
    <Card key={id} className="student-detail-student-info-card">
      <Card.Body className="student-detail-student-info-card-body">
        <Row>
          <div className="student-detail-student-info-card-profilepic">
            <div style={{ flex: 4 }}>
              <Card.Title className="bold-text">{`${firstName} ${lastName}`}</Card.Title>
              <Card.Subtitle>{relationship}</Card.Subtitle>
              <Card.Text>{phone}</Card.Text>
              <Card.Text>{address}</Card.Text>
            </div>
            <div>
              <ProfilePic pictureUrl={pictureurl} />
            </div>
          </div>
        </Row>
      </Card.Body>
      {isPrimary ? <Card.Footer style={{ textAlign: 'right' }}>Primary Contact</Card.Footer> : ''}
    </Card>
  );
};

export default StudentGuardianContainer;
