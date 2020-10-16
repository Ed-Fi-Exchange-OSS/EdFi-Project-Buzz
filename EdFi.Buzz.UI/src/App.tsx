/*
 * SPDX-License-Identifier: Apache-2.0
 * Licensed to the Ed-Fi Alliance under one or more agreements.
 * The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
 * See the LICENSE and NOTICES files in the project root for more information.
 */


import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, useHistory, Redirect } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';

import EnvironmentService from 'Services/EnvironmentService';
import configureDI from 'DIContext';

import ApiService from 'Services/ApiService';
import { Header } from 'Components/Header';
import { Footer } from 'Components/Footer';
import { Login } from 'Feature/Login';
import { StudentRoster } from 'Feature/StudentRoster';
import { StudentDetail } from 'Feature/StudentDetail';
import { SurveyAnalytics } from 'Feature/SurveyAnalytics';
import { UploadSurvey } from 'Feature/UploadSurvey';
import { AdminSurvey } from 'Feature/AdminSurvey';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import GlobalFonts from 'globalstyle';
import BuzzTheme from 'buzztheme';

const container = configureDI();
const api = container.get<ApiService>('ApiService');

const env = container.get<EnvironmentService>('EnvironmentService').environment;


export default function App(): JSX.Element {
  const [appMounted,setAppMounted]=useState(false);
  const [buzzLogo,setBuzzLogo]=useState({default:''});
  const [buzzTitle,setBuzzTitle]=useState(env.TITLE);
  const [buzzTitleLogo,setBuzzTitleLogo]=useState({default:''});
  // TODO Resolve the componentWillReceiveProps has been renamed warning.
  console.warn = () => { };
  const HEADER_HEIGHT = 70;
  const FOOTER_HEIGHT = 68;
  const [isLoggedIn, setIsLoggedIn] = useState(api.authentication.currentUserValue != null);
  const [isAdminSurveyLoader, setIsAdminSurveyLoader] =
    useState(api.authentication.currentUserValue?.teacher?.isadminsurveyloader === true);
  const [isTeacherSurveyLoader, setIsTeacherSurveyLoader] =
    useState(api.authentication.currentUserValue?.teacher?.isteachersurveyloader === true);
  const Content = styled.div`
    @media(max-width:768px){
      padding-top: ${HEADER_HEIGHT}px;
      margin-bottom: ${FOOTER_HEIGHT}px;
      max-height: calc(100vh-${HEADER_HEIGHT+FOOTER_HEIGHT}px);
      min-height: calc(100vh-${HEADER_HEIGHT+FOOTER_HEIGHT}px);
      max-width: 100vw;
      overflow-y: scroll;
      overflow-x: hidden;
      z-index: -1;
      margin-left:0.50em;
      margin-right:0.50em;
    }
  `;
  useEffect(() => {
    const suscription = api.authentication.currentUser.subscribe((cu) => {
      setIsLoggedIn(cu && cu.teacher != null);
      setIsAdminSurveyLoader(cu?.teacher?.isadminsurveyloader === true);
      setIsTeacherSurveyLoader(cu?.teacher?.isteachersurveyloader === true);
    });
    setAppMounted(true);
    return () => suscription.unsubscribe();
  });

  useEffect(() => {
    if(appMounted){
      setBuzzTitle(env.TITLE);
      if(env.EXTERNAL_LOGO){
        if(env.LOGO && env.LOGO !== ''){
          setBuzzLogo({default: env.LOGO});
        }
        if(env.TITLE_LOGO && env.TITLE_LOGO !== ''){
          setBuzzTitleLogo({default: env.TITLE_LOGO});
        }
      } else{
        if(env.LOGO && env.LOGO !== ''){
          import(`assets/${env.LOGO}`).then(image => {
            setBuzzLogo({default:image.default});
          });
        }
        if(env.TITLE_LOGO && env.TITLE_LOGO !== ''){
          import(`assets/${env.TITLE_LOGO}`).then(image => {
            setBuzzTitleLogo({default:image.default});
          });
        }
      }
    }

  },[appMounted]);

  function RouterContent(): JSX.Element {
    const history = useHistory();
    return <Switch>
      <Route path="/login" >
        <Login
          api={api}
          navigate={(url) => history.replace(url)}
          googleClientId={env.GOOGLE_CLIENT_ID}
          returnUrl="/"
          LoginLogo={buzzLogo.default}
          LoginLogoWidth={env.LOGIN_LOGO_WIDTH}
        />
      </Route>
      {!isLoggedIn ? <Redirect to="/login" /> : <Route path="/">
        <div>
          <Header api={api}
            isAdminSurveyLoader={isAdminSurveyLoader}
            isTeacherSurveyLoader={isTeacherSurveyLoader}
            navigate={(url) => history.push(url)}
            height={HEADER_HEIGHT}
            title={buzzTitle}
            titleLogo={buzzTitleLogo.default}
            titleLogoWidth={env.TITLE_LOGO_WIDTH}
            titleLogoHeight={env.TITLE_LOGO_HEIGHT}
          />
          {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
          <Content>
            <Switch>
              <Route exact path="/"> <StudentRoster api={api} /> </Route>
              <Route path="/studentDetail/:studentKey"> <StudentDetail api={api} /> </Route>
              <Route path="/surveyAnalytics"> <SurveyAnalytics api={api} /> </Route>
              <Route path="/uploadSurvey/:surveyKey"> <UploadSurvey api={api} /> </Route>
              {isAdminSurveyLoader || isTeacherSurveyLoader
                ? <Route path="/uploadSurvey"> <UploadSurvey api={api} /> </Route>
                : <Route><div>Need upload survey rights</div></Route>}
              {isAdminSurveyLoader
                ? <Route path="/adminSurvey"> <AdminSurvey api={api} /> </Route>
                : <Route><div>Need survey admin rights</div></Route>}

            </Switch>
          </Content>
          <Footer height={FOOTER_HEIGHT}/>
        </div>
      </Route>}
    </Switch>;
  }

  return (

    <Router>
      <GlobalFonts />
      <ThemeProvider theme={BuzzTheme}>
        <RouterContent />
      </ThemeProvider>
    </Router>
  );
}
