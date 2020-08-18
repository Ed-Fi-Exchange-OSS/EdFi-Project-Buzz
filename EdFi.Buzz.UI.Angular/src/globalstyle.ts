// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { createGlobalStyle } from 'styled-components';
import WorkSansWoff from './fonts/WorkSans.woff';
import WorkSansWoff2 from './fonts/WorkSans.woff2';
import WorkSansExtraBoldWoff from './fonts/WorkSansExtraBold.woff';
import WorkSansExtraBoldWoff2 from './fonts/WorkSansExtraBold.woff2';

export default createGlobalStyle`

  :root {
    --dark-grey: #1b1c1d;
    --white: #ffffff;
    --lavender: #f5f7fc;
    --lightsteelblue: #a2b6be;
    --steelblue: #1378be;
    --orange: #f8992e;
    --darkgray: #1b1c1d;
    --gray: #727d94;
    --lightgray: #ced5d8;
  }

  @font-face {
      font-family: 'Work Sans';
      src: local('Work Sans'), local('WorkSans'),
      url(${WorkSansWoff2}) format('woff2'),
      url(${WorkSansWoff}) format('woff');
  }

  @font-face {
      font-family: 'Work Sans Extra Bold';
      src: local('Work Sans Extra Bold'), local('WorkSansExtraBold'),
      url(${WorkSansExtraBoldWoff2}) format('woff2'),
      url(${WorkSansExtraBoldWoff}) format('woff');
  }

  *{
    text-rendering: optimizeLegibility;
  }

  .h1-desktop{
    font-family: 'Work Sans Extra Bold';
    font-size: 32px;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: var(--dark-grey);
  }

  .h1-headline{
    font-family: 'Work Sans';
    font-size: 24px;
    font-weight: 800;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: var(--dark-grey);
  }

  .h2-desktop{
    font-family: 'Work Sans Extra Bold';
    font-size: 20px;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: var(--dark-grey);
  }

  .h2-headline{
    font-family: 'Work Sans';
    font-size: 16px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: var(--dark-grey);
  }

  .email-icon {
    height: 10px;
    width: 16px;
    margin: 0px 10px 0px 0px;
  }

  .phone-icon {
    height: 16px;
    width: 16px;
    margin: 0px 10px 0px 0px;
  }

  .star-image {
    height: 16px;
    width: 16px;
    margin: 0px 5px 0px 0px;
  }

`;
