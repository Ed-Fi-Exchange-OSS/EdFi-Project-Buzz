/*
 * SPDX-License-Identifier: Apache-2.0
 * Licensed to the Ed-Fi Alliance under one or more agreements.
 * The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
 * See the LICENSE and NOTICES files in the project root for more information.
 */


import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, useHistory, Redirect } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

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

  // TODO Resolve the componentWillReceiveProps has been renamed warning.
  console.warn = () => { };

  const [isLoggedIn, setIsLoggedIn] = useState(api.authentication.currentUserValue != null);
  const [isAdminSurveyLoader, setIsAdminSurveyLoader] =
    useState(api.authentication.currentUserValue?.teacher?.isadminsurveyloader === true);

  useEffect(() => {
    const suscription = api.authentication.currentUser.subscribe((cu) => {
      setIsLoggedIn(cu && cu.teacher != null);
      setIsAdminSurveyLoader(cu?.teacher?.isadminsurveyloader === true);
    });
    return () => suscription.unsubscribe();
  });

  function RouterContent(): JSX.Element {
    const history = useHistory();
    return <Switch>
      <Route path="/login" >
        <Login
          api={api}
          navigate={(url) => history.replace(url)}
          googleClientId={env.GOOGLE_CLIENT_ID}
          returnUrl="/"
        />
      </Route>
      {!isLoggedIn ? <Redirect to="/login" /> : <Route path="/">
        <div>
          <Header api={api} navigate={(url) => history.push(url)} />
          {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
          <Switch>
            <Route exact path="/"> <StudentRoster api={api} /> </Route>
            <Route path="/studentDetail/:studentKey"> <StudentDetail /> </Route>
            <Route path="/surveyAnalytics"> <SurveyAnalytics api={api} /> </Route>
            <Route path="/uploadSurvey/:surveyKey"> <UploadSurvey /> </Route>
            <Route path="/uploadSurvey"> <UploadSurvey /> </Route>
            {isAdminSurveyLoader
              ? <Route path="/adminSurvey"> <AdminSurvey api={api} /> </Route>
              : <Route><div>Need survey admin rights</div></Route>}
          </Switch>

          <Footer />
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
