// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { createGlobalStyle } from 'styled-components';
import WorkSansWoff from './WorkSans.woff';
import WorkSansWoff2 from './WorkSans.woff2';
import WorkSansExtraBoldWoff from './WorkSansExtraBold.woff';
import WorkSansExtraBoldWoff2 from './WorkSansExtraBold.woff2';

export default createGlobalStyle`
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
`;
