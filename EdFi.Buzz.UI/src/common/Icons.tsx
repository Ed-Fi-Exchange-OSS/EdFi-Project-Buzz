// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import * as React from 'react';

import Mail from '../assets/mail.png';
import Phone from '../assets/phone.png';
import Star from '../assets/star.png';
// import Grid from '../assets/grid.png';
// import Table from '../assets/table.png';
import ChevronDown from '../assets/chevron-down.png';
import ChevronUp from '../assets/chevron-up.png';

export const EmailIcon: React.FunctionComponent = () => <img className='email-icon' src={Mail} />;

export const PhoneIcon: React.FunctionComponent = () => <img className='phone-icon' src={Phone} />;

export const StarIcon: React.FunctionComponent = () => <img className='star-icon' src={Star} />;

// export const GridIcon: React.FunctionComponent = () => <img className='grid-icon' src={Grid} />;

// export const TableIcon: React.FunctionComponent = () => <img className='table-icon' src={Table} />;

export const ChevronDownIcon: React.FunctionComponent = () => <img className='chevron-down-icon' src={ChevronDown} />;

export const ChevronUpIcon: React.FunctionComponent = () => <img className='chevron-up-icon' src={ChevronUp} />;

// export const LeftArrowIcon: React.FunctionComponent = () => <img src={LeftArrow} style={{ width: '14px', height: '14px' }} />;
