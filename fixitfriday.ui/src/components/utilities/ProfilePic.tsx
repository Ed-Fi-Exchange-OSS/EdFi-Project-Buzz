import React, { FunctionComponent } from 'react';
import { Card } from 'react-bootstrap';

interface ProfilePicProps {
  pictureUrl?: string;
}

const ProfilePic: FunctionComponent<ProfilePicProps> = ({ pictureUrl }: ProfilePicProps) => {
  return <Card.Img style={{ width: 'auto', height: 'auto', maxWidth: '5em' }} src={pictureUrl} />;
};

export default ProfilePic;
