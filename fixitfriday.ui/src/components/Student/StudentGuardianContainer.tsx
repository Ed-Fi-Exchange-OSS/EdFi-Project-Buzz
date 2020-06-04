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
    <Card
      key={id}
      style={{
        flex: '1',
        border: '1px solid #696969',
        minWidth: '16rem',
        maxWidth: '16rem',
        paddingTop: '5px',
        marginTop: '10px',
        marginLeft: '10px',
        marginRight: '10px',
      }}
    >
      <Card.Body style={{ paddingLeft: '25px' }}>
        <Row>
          <div style={{ display: 'flex' }}>
            <div style={{ flex: 4, marginRight: '3px' }}>
              <Card.Title>{`${firstName} ${lastName}`}</Card.Title>
              <Card.Subtitle>{relationship}</Card.Subtitle>
              <Card.Text>{phone}</Card.Text>
              <Card.Text>{address}</Card.Text>
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
          </div>
        </Row>
      </Card.Body>
      {isPrimary ? <Card.Footer style={{ textAlign: 'right' }}>Primary Contact</Card.Footer> : ''}
    </Card>
  );
};

export default StudentGuardianContainer;
