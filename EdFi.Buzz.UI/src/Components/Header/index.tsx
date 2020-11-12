/*
 * SPDX-License-Identifier: Apache-2.0
 * Licensed to the Ed-Fi Alliance under one or more agreements.
 * The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
 * See the LICENSE and NOTICES files in the project root for more information.
 */

import * as React from 'react';
import { FunctionComponent, ReactFragment, useState, createRef, useEffect } from 'react';
import { Link, useRouteMatch, useHistory } from 'react-router-dom';
import ArrowDown from 'assets/dropdown-arrow.png';
import ApiService from 'Services/ApiService';
import styled from 'styled-components';
import Icon from '@iconify/react';
import mdUnlock from '@iconify-icons/ion/md-unlock';
import mdBuild from '@iconify-icons/ion/md-build';
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
    height: 26px;
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
  const history = useHistory();
  const [menuActive, setMenuActive] = useState(false);
  const { teacher } = props.api.authentication.currentUserValue;
  const { isAdminSurveyLoader } = props;
  const { height } = props;

  const menuAdminSurveyRef = createRef<HTMLLIElement>();
  const menuLogoutRef = createRef<HTMLLIElement>();

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

  const LoggedUserMenu = styled.div`
  display: inline-block;
  padding: .0em 1em;
  height: 26px;
  font-family:'Work Sans', sans-serif;
  font-size: 16px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #ffffff;
  text-transform: uppercase;
  cursor: pointer;
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
    color: #333333;
  };
 &.active {
    display: flex;
    flex-wrap: nowrap;
    flex-flow: column;
    position: fixed;
    right: 0px;
  }
`;

  const MainNav = styled.nav`
  ul {
	  margin: 1em 0 .5em;
	  text-align: left;
  };
  li {
    display: inline-block;
  }
  a {
	  display: inline;
	  padding: .5em 1.5em;
    height: 26px;
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
  background-image: linear-gradient(94deg, #333333 6%, #000000 93%);
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

  const goToRoster = (event) => {
    if(event.key === 'Enter'){
      history.push('/');
    }
  };

  const goToSurveyAnalytics = (event) => {
    if(event.key === 'Enter'){
      history.push('/surveyAnalytics');
    }
  };

  const goToAdminSurvey = (event) => {
    if(event.key === 'Enter'){
      history.push('/adminSurvey');
    }
  };

  useEffect(()=> {
    if (isAdminSurveyLoader) {
      menuAdminSurveyRef.current.focus();
    } else {
      menuLogoutRef.current.focus();
    }
  }, [menuActive]);

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
            <li tabIndex={1} onKeyPress={goToRoster}> <CustomLink to="/" activeOnlyWhenExact={true}>Class Roster</CustomLink> </li>
            <li tabIndex={1} onKeyPress={goToSurveyAnalytics}> <CustomLink to="/surveyAnalytics">Surveys</CustomLink> </li>
            <li tabIndex={1} onKeyPress={() => setMenuActive(!menuActive)}>
              <LoggedUserMenu onClick={() => setMenuActive(!menuActive)}>
                <span>
                  {`${teacher.firstname} ${teacher.lastsurname}`} &nbsp;<MenuArrow src={ArrowDown}></MenuArrow>
                </span>
                <MenuOptions className={menuActive ? 'active' : ''}>
                  <ul>
                    {isAdminSurveyLoader
                      ? <li tabIndex={1} onKeyPress={goToAdminSurvey} ref={menuAdminSurveyRef}>
                        <Link to="/adminSurvey">
                          <LinkButton><Icon icon={mdBuild}></Icon>&nbsp;Admin Survey</LinkButton>
                        </Link>
                      </li>
                      : null}
                    <LoadOdsSurveysMenuOption isAdminSurveyLoader={isAdminSurveyLoader} api={props.api}/>
                    <li tabIndex={1} onKeyPress={logOut} ref={menuLogoutRef}>
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

