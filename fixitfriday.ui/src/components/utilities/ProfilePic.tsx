import React, { FunctionComponent, SyntheticEvent } from 'react';
import { Card } from 'react-bootstrap';

interface ProfilePicProps {
  firstname: string;
  lastname: string;
  pictureUrl: string;
}

const ProfilePic: FunctionComponent<ProfilePicProps> = ({ pictureUrl, firstname, lastname }: ProfilePicProps) => {
  const addDefaultSrc = (ev: SyntheticEvent) => {
    const element = ev.currentTarget as HTMLElement;
    element.style.visibility = 'hidden';
  };

  const picSrc = pictureUrl && pictureUrl.length > 0 ? pictureUrl : '';

  return (
    <Card.Img
      style={{ width: 'auto', height: 'auto', minWidth: '100%' }}
      alt={`Picture of ${firstname} ${lastname}`}
      onError={addDefaultSrc}
      src={picSrc}
    />
  );
};

export default ProfilePic;
