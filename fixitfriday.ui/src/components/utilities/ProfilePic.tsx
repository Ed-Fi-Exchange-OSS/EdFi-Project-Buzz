import React, { FunctionComponent } from 'react';
import { Card } from 'react-bootstrap';
import profile from '../../profile.png';

type ProfilePicProps = {
  pictureUrl?: string;
};

const ProfilePic: FunctionComponent<ProfilePicProps> = ({ pictureUrl }: ProfilePicProps) => {
  return (
    <Card.Img
      style={{ border: '1px solid black', width: 'auto', height: 'auto', maxWidth: '5em', marginRight: '5px' }}
      src={pictureUrl !== '' ? pictureUrl : profile}
    />
  );
};

export default ProfilePic;
