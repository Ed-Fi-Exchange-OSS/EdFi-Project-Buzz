/*
 * SPDX-License-Identifier: Apache-2.0
 * Licensed to the Ed-Fi Alliance under one or more agreements.
 * The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
 * See the LICENSE and NOTICES files in the project root for more information.
 */


import React from 'react';
import { BrowserRouter as Router, Switch, Route, useHistory } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';


import { ApiService } from 'Services/ApiService';
import { Header } from 'Components/Header';
import { Footer } from 'Components/Footer';
import { Login } from 'Feature/Login';
import { StudentRoster } from 'Feature/StudentRoster';
import { StudentDetail } from 'Feature/StudentDetail';
import { SurveyAnalytics } from 'Feature/SurveyAnalytics';
import { UploadSurvey } from 'Feature/UploadSurvey';
import { AdminSurvey } from 'Feature/AdminSurvey';

import './App.css';
import configureDI from 'DIContext';

const container = configureDI();
const apolloClient = container.get<ApolloClient<InMemoryCache>>("ApolloClient");


export default function App(): JSX.Element {
  const history = useHistory();
  console.log("history:", history);
  return (
    <ApolloProvider client={apolloClient}>
      <Router>
        <div>
          <Header />

          {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
          <Switch>
            <Route path="/login"> <Login
              api={container.get<ApiService>("ApiService")}
              navigate={(url)=> console.log("TODO: implement navigate")}
              googleClientId="761615059487-5tuhthkic53s5m0e40k6n68hrc7i3udp.apps.googleusercontent.com"
              returnUrl="/"

            /> </Route>
            <Route exact path="/"> <StudentRoster /> </Route>
            <Route path="/studentDetail/:studentKey"> <StudentDetail /> </Route>
            <Route path="/surveyAnalytics"> <SurveyAnalytics /> </Route>
            <Route path="/uploadSurvey/:surveyKey"> <UploadSurvey /> </Route>
            <Route path="/uploadSurvey"> <UploadSurvey /> </Route>
            <Route path="/adminSurvey"> <AdminSurvey /> </Route>
          </Switch>

          <Footer />
        </div>
      </Router>
    </ApolloProvider>
  );
}
