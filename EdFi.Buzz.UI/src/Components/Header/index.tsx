/*
 * SPDX-License-Identifier: Apache-2.0
 * Licensed to the Ed-Fi Alliance under one or more agreements.
 * The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
 * See the LICENSE and NOTICES files in the project root for more information.
 */

import * as React from 'react';
import { FunctionComponent, ReactFragment } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { ApiService } from 'Services/ApiService';
import styled from 'styled-components';


interface CustomLikComponentProps {
  children: ReactFragment;
  to: string;
  activeOnlyWhenExact?: boolean;
}

function CustomLink({
  to,
  activeOnlyWhenExact,
  children
}: CustomLikComponentProps) {
  const match = useRouteMatch({
    path: to,
    exact: activeOnlyWhenExact
  });

  return (
    <div className={match ? 'active' : ''}>
      {match && '> '}
      <Link to={to}>{children}</Link>
    </div>
  );
}


export interface HeaderComponentProps {
  title?: string;
  api: ApiService;
  navigate: (url: string) => void;
}

const LinkButton = styled.button`
  color: #007bff;
  background: transparent;
  border: none;
  padding: 0;

  &:hover {
    color: #0056b3;
    text-decoration: underline;
  }
`;
export const Header: FunctionComponent<HeaderComponentProps> = (
  props: HeaderComponentProps
) => {
  function logOut(){
    props.api.authentication.logout();
    props.navigate('/login');
  }
  return <div>
    Header {props.title ?? ''}
    <ul>
      <li> <CustomLink to="/login">Login (/login)</CustomLink> </li>
      <li> <CustomLink to="/" activeOnlyWhenExact={true}> Student Roster (/)</CustomLink> </li>
      <li> <CustomLink to="/studentDetail/1">Student Detail (/studentDetail/1) </CustomLink> </li>
      <li> <CustomLink to="/surveyAnalytics">Survey Analytics (/surveyAnalytics)</CustomLink> </li>
      <li> <CustomLink to="/uploadSurvey" activeOnlyWhenExact={true}> Upload Survey (/uploadSurvey)</CustomLink> </li>
      <li> <CustomLink to="/uploadSurvey/1">Upload Survey (/uploadSurvey/1)</CustomLink> </li>
      <li> <CustomLink to="/adminSurvey">Admin Survey (/adminSurvey)</CustomLink> </li>
      <li> <LinkButton onClick={logOut} >LogOut</LinkButton> </li>
    </ul>
  </div>;
};
