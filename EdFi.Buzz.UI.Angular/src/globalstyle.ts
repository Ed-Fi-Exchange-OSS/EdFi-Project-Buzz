// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import styled, { createGlobalStyle } from 'styled-components';
import WorkSansWoff from './fonts/WorkSans.woff';
import WorkSansWoff2 from './fonts/WorkSans.woff2';
import WorkSansExtraBoldWoff from './fonts/WorkSansExtraBold.woff';
import WorkSansExtraBoldWoff2 from './fonts/WorkSansExtraBold.woff2';
import OpenSansTtf from './fonts/OpenSans-Regular.ttf';
import OpenSansBoldTtf from './fonts/OpenSans-Bold.ttf';

export const StyledBuzzButton = styled.button`
  background-color: var(--picton-blue);
  color: white;
  font-size: 14px;
  border: none;
  outline: none;
  padding: .5rem .5rem;
  border-radius: 4px;
  margin: .5rem 1rem;

  &:focus {
    border: none;
    outline: none;
  }

  &:active {
    background-color: var(--denim);
    border: none;
    outline: none;
  }
`;

export default createGlobalStyle`

  :root {
    --white: #ffffff;
    --picton-blue: #17b6ea;
    --denim: #1378be;
    --shark: #1b1c1d;
    --tower-gray: #a2b6be;
    --sunglow: #ffc62d;
    --white-lilac: #f5f7fc;
    --athens-gray: #ecf0f2;
    --sea-buckthorn1: #f8992e;
    --hit-gray: #a6b1ba;
    --nevada: #5a6b72;
    --slate-gray: #727d94;
    --sea-buckthorn2: #faa823;
    --mystic: #ebf1f3;
    --iron: #ced5d8;
    --tradewind: #65bcaa;
    --mystic-grape: #98288b;
  }

  @font-face {
      font-family: 'Open Sans';
      src: local('Open Sans'), local('OpenSans'),
      url(${OpenSansTtf}) format('ttf');
  }

  @font-face {
      font-family: 'Open Sans Bold';
      src: local('Open Sans Bold'), local('OpenSansBold'),
      url(${OpenSansBoldTtf}) format('ttf');
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

  * {
    text-rendering: optimizeLegibility;
  }

  body {
    font-family: 'Work Sans';
    font-size: 16px;
    color: var(--nevada);
    font-weight: 400;
    line-height: 1.5rem;
    padding-top: 2rem;
    background-color: var(--white);
    width: 100vw;
  }

  body, main, .container-fluid, .container, .container-lg, .container-md, .container-sm, .container-xl {
    padding-left: 0rem;
    padding-right: 0rem;
  }

  .navbar, .buttons-footer[_ngcontent-ng-cli-universal-c0] {
    width: 100vw;
  }

  h1, .h1 {
    font-family: 'Work Sans Extra Bold';

    @media (min-width: 769px){
      font-size: 32px;
    }

    @media (max-width: 768px){
      font-size: 24px;
    }

    font-weight: 800;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: var(--shark);
    margin-bottom: 0;
  }

  h2, .h2-desktop{
    flex: 1;
    font-family: 'Work Sans Extra Bold';
    font-weight: 400;
    font-size: 18px;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: var(--shark);
  }

  .h2-headline{
    font: 'Work Sans';
    font-size: 16px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: var(--tower-gray);
  }

  .italics {
    font-style: italic;
  }

  .image-container {
      border-radius: 50%;
      display: flex !important;
      justify-content: center;
      align-items: center;
  }

  .info {
    font-size: 16px;
    padding: 1.5rem;
  }

  .label {
    font-size: 16px;
    padding: 1.5rem;
  }

  .bold {
    font-weight: 600 !important;
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

  .star-icon {
    height: 16px;
    width: 16px;
    margin: 0px 10px 0px 0px;
  }

  .text-ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .alert {
    border: 4px solid var(--sea-buckthorn1);
    border-radius: 4px;
    color: var(--shark);
  }

  textarea {
    border: 1px solid var(--iron);
    outline: none;
    resize: none;
    overflow: auto;
    @media(max-width: 768px){
      width: 20rem;
      height: 6rem;
    }
  }

`;
