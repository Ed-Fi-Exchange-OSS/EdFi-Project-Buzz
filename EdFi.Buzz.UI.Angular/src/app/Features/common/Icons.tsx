// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import * as React from 'react';

import Mail from '../../../assets/mail.png';
import Phone from '../../../assets/phone.png';
import Star from '../../../assets/star.png';

export function EmailIcon() {
  return (<img className='email-icon' src={Mail} />);
}

export function PhoneIcon() {
  return (<img className='phone-icon' src={Phone} />);
}

export function StarIcon() {
  return (<img className='star-icon' src={Star} />);
}
