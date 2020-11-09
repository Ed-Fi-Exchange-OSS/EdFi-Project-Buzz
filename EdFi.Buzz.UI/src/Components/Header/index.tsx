/*
 * SPDX-License-Identifier: Apache-2.0
 * Licensed to the Ed-Fi Alliance under one or more agreements.
 * The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
 * See the LICENSE and NOTICES files in the project root for more information.
 */

import * as React from 'react';
import { FunctionComponent, ReactFragment, useState } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import ArrowDown from 'assets/dropdown-arrow.png';
import ApiService from 'Services/ApiService';
import styled from 'styled-components';
import Icon from '@iconify/react';
import mdUnlock from '@iconify-icons/ion/md-unlock';
import mdBuild from '@iconify-icons/ion/md-build';
import mdUpload from '@iconify-icons/ion/md-cloud-upload';
import { LoadOdsSurveysMenuOption } from './loadodssurvey';

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
  const CustomLinkStyle = styled.div`
    display: inline-block;
	  padding: .0em 0.0em;
    height: 19px;
    font-family:'Work Sans', sans-serif;
    font-size: 16px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #ffffff;
    text-transform: uppercase;
    @media(max-width: 768px){
      display: none;
    }
  `;
  const LinkIsActive = styled.div`
    &.active {
      width: 100%;
      height: 1px;
      border: solid 4px #ffc62d;
      text-align: center;
    }
    @media(max-width: 768px){
      &.active {
        display: none;
      }
    }
  `;
  return (
    <CustomLinkStyle >
      <Link to={to}>{children}</Link>
      <LinkIsActive className={match ? 'active' : ''}></LinkIsActive>
    </CustomLinkStyle>
  );
}

export interface HeaderComponentProps {
  title?: string;
  api: ApiService;
  isAdminSurveyLoader?: boolean;
  isTeacherSurveyLoader?: boolean;
  navigate: (url: string) => void;
  height: number;
  titleLogo: string;
  titleLogoWidth: string;
  titleLogoHeight: string;
}

export const Header: FunctionComponent<HeaderComponentProps> = (
  props: HeaderComponentProps
) => {
  const [menuActive, setMenuActive] = useState(false);
  const { teacher } = props.api.authentication.currentUserValue;
  const { isAdminSurveyLoader, isTeacherSurveyLoader } = props;
  const { height } = props;
  const LinkButton = styled.button`
  text-transform: uppercase;
  color: #007bff;
  background: transparent;
  border: none;
  padding: 0;
  height: 19px;
  font-family:'Work Sans', sans-serif;
  font-size: 16px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  &:hover {
    color: #0056b3;
    text-decoration: none;
  }

`;

  const HeaderImage = styled.img`
  margin: 0 0 10px;
  margin-left: 10px;
  max-width: 150px;
	max-height: 64px;
  width: ${props.titleLogoWidth};
	height: ${props.titleLogoHeight};
`;

  const HeaderLogo = styled.span`
  width: 80px;
  height: 64px;
  object-fit: contain;
  font-family: 'Work Sans', sans-serif;
  font-size: 32px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #ffffff;
  float:left;
  display: flex;
  align-items: center;
`;

  const MenuOptions = styled.span`
  position: absolute;
  display:none;
  padding-top:11px;
  z-index:2;
  color: var(--dark-grey);
  @media(max-width: 768px){
    padding-top:17px;
  }
  ul {
	  display: flex;
    flex-wrap: nowrap;
    flex-flow: column;
    justify-content: flex-end;
    position:relative;
    margin:0 0 0 100%;
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.6);
    background-color: #ebf1f3;
    text-align: left;
    padding-left: 0px;
    padding-bottom: 0.5em;
  };
  li {
    display: inline;
    padding: 0em 0em;
  };
  ${LinkButton} {
    display: inline-block;
	  padding: .5em 0em;
    text-align: left;
    color: var(--nevada);
  };
 &.active {
    display: flex;
    flex-wrap: nowrap;
    flex-flow: column;
    width: 40%;
    position: fixed;
    right: 0px;
  }
`;

  const LoggedUserMenu = styled.span`
  width: 92px;
  height: 15px;
  font-family: 'Work Sans', sans-serif;
  font-size: 13px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  align-self: left;
  color: #ffffff;
  cursor: pointer;
  vertical-align: baseline;
`;

  const LoggedUser = styled.span`

`;

  const MainNav = styled.nav`
  ul {
	  margin: 1em 0 .5em;
	  text-align: left;
  };
  li {
    display: inline;
  }
  a {
	  display: inline-block;
	  padding: .5em 1.5em;
    height: 19px;
    font-family: 'Work Sans', sans-serif;
    font-size: 16px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #ffffff;
    text-transform: uppercase;
  }
 `;

  const MenuArrow = styled.img`
  height: 8px;
  object-fit: contain;
`;

  const MainContainer = styled.div`
  ${HeaderLogo} {
    flex: 1;
  };
  ${MainNav} {
    float: right;
  };
`;

  const MainHeader = styled.header`
  width: 100%;
  height: ${height}px;
  background-image: linear-gradient(94deg, #17b6ea 6%, #1378be 93%);
  justify-content: flex-end;

  @media(max-width: 768px){
    z-index: 1;
    position: fixed;
  }
  ${MainContainer} {
	  display: flex;
    align-items: left;
    justify-content: flex-end;
    flex-wrap: nowrap;
    flex-direction: row;
  }`;

  const closeMenu = () => {
    if (menuActive) {
      setMenuActive(false);
    }
  };

  function logOut() {
    props.api.authentication.logout();
    props.navigate('/login');
  }
  return <>
    <MainHeader onClick={closeMenu}>
      <MainContainer>
        <HeaderLogo><HeaderImage src={props.titleLogo} alt={props.title} /></HeaderLogo>
        <MainNav>
          <ul>
            <li tabIndex={1}> <CustomLink to="/" activeOnlyWhenExact={true}>Class Roster</CustomLink> </li>
            <li tabIndex={1}> <CustomLink to="/surveyAnalytics">Surveys</CustomLink> </li>
            <li tabIndex={1}>
              <LoggedUserMenu onClick={() => setMenuActive(!menuActive)} >
                <LoggedUser>
                  {`${teacher.firstname} ${teacher.lastsurname}`} &nbsp;<MenuArrow src={ArrowDown}></MenuArrow>&nbsp;&nbsp;
                </LoggedUser>
                <MenuOptions className={menuActive ? 'active' : ''}>
                  <ul>
                    {isAdminSurveyLoader
                      ? <li tabIndex={1}>
                        <Link to="/adminSurvey">
                          <LinkButton><Icon icon={mdBuild}></Icon>&nbsp;Admin Survey</LinkButton>
                        </Link>
                      </li>
                      : null}
                    {isAdminSurveyLoader || isTeacherSurveyLoader
                      ? <li tabIndex={1}>
                        <Link to="/uploadSurvey">
                          <LinkButton><Icon icon={mdUpload}></Icon>&nbsp;Upload Survey</LinkButton>
                        </Link>
                      </li>
                      : null}
                    <LoadOdsSurveysMenuOption isAdminSurveyLoader={isAdminSurveyLoader} api={props.api}/>
                    <li tabIndex={1}>
                      <Link to="/Login">
                        <LinkButton onClick={logOut}><Icon icon={mdUnlock}></Icon>&nbsp;LogOut</LinkButton>
                      </Link>
                    </li>
                  </ul>
                </MenuOptions>
              </LoggedUserMenu>
            </li>
          </ul>
        </MainNav>
      </MainContainer>
    </MainHeader>
  </>;
};

