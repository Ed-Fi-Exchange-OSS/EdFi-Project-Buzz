import React, { FunctionComponent, SyntheticEvent } from 'react';
import { Card } from 'react-bootstrap';

interface ProfilePicProps {
  firstname: string;
  lastname: string;
  pictureUrl: string;
}

const ProfilePic: FunctionComponent<ProfilePicProps> = (props: ProfilePicProps) => {
  const addDefaultSrc = (ev: SyntheticEvent) => {
    const element = ev.currentTarget as HTMLElement;
    element.style.visibility = 'hidden';
  };

  const picSrc = props.pictureUrl && props.pictureUrl.length > 0 ? props.pictureUrl : ""

  return (
    <Card.Img
      style={{ width: 'auto', height: 'auto', minWidth: '100%' }}
      alt={`Picture of ${props.firstname} ${props.lastname}`}
      onError={addDefaultSrc}
      src={picSrc}
    />
  );
};

export default ProfilePic;
