import React, { FunctionComponent } from 'react';
import { Card, Media } from 'react-bootstrap';
import { StudentDetailSiblingType } from './types/StudentDetailSiblingType';
import ProfilePic from '../utilities/ProfilePic';

const StudentSiblingContainer: FunctionComponent<StudentDetailSiblingType> = ({
  firstName,
  lastName,
  gradeLevel,
  school,
  pictureurl,
}) => {
  return (
    <Media
      style={{
        marginBottom: '10px',
        marginTop: '10px'
      }}
    >
      <div
        style={{
          margin: '2px 1em 2px 2px',
          width: '80px',
        }}
      >
        <ProfilePic pictureUrl={pictureurl} />
      </div>
      <Media.Body>
        <Card.Text>
          {`${firstName} ${lastName}`}
          <br />
          {gradeLevel}
          <br />
          {school}
        </Card.Text>
      </Media.Body>
    </Media>
  );
};

export default StudentSiblingContainer;
