// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import styled from 'styled-components';

export const MainContainer = styled.main`
  font-family: ${(props) => props.theme.fonts.regular};
  background-color: var(--white);
  padding: 15px;
`;

export const HeadlineContainer = styled.div`

  display: flex;
  align-items: center;
  margin-left: .2rem;
  margin-right: .2rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
  @media (min-width: 769px) {
    flex-direction: row;
  }
`;

export const TitleSpanContainer = styled.div`
  flex: 0 0 auto;
  margin-right: 2rem;
  font-family: 'Work Sans Extra Bold';
  font-size: 24px;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: var(--shark);
`;

export const TotalRecordsContainer = styled.div`

  @media (min-width: 769px) {
    flex-direction: row;
  }

  @media (max-width: 768px) {
    flex: 1;
    flex-direction: column;
  }

  font-family: ${(props) => props.theme.fonts.regular};
  font-size: 14px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: var(--tower-gray);

  & div {
    display: flex;
    flex: 1;
    align-items: center;
    align-content:center;
    height: 100%;
  }
`;

export const StyledCard = styled.div`
  font-size: 14px;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  background-color: var(--white-lilac);
  border: ${(props) => props.theme.border};
  margin-bottom: 30px;
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  background-clip: border-box;
  border-radius: 4px;

  .card-body {
    flex: 1 1 auto;
    min-height: 1px;
    padding: 0.6rem;
    color: var(--shark);
  }
`;

const BuzzTheme = {
  colors: {
    white: '#ffffff',
    pictonblue: '#17b6ea',
    denim: '#1378be',
    shark: '#1b1c1d',
    towerGray: '#a2b6be',
    sunglow: '#ffc62d',
    whiteLilac: '#f5f7fc',
    athensGray: '#ecf0f2',
    seaBuckthorn1: '#f8992e',
    hitGray: '#a6b1ba',
    nevada: '#5a6b72',
    slateGray: '#727d94',
    seaBuckthorn2: '#faa823',
    mystic: '#ebf1f3',
    iron: '#ced5d8',
  },
  fonts: {
    regular: 'Work Sans',
    bold: 'Work Sans Extra Bold',
  },
  border: 'solid 2px #ced5d8',
};

export default BuzzTheme;
