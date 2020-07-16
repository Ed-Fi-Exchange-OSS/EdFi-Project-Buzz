// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

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
