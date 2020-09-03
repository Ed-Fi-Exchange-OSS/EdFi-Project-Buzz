import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { Header } from './Components/Header';
import { Footer } from './Components/Footer';
import { Login } from './Feature/Login';
import { StudentRoster } from './Feature/StudentRoster';
import { StudentDetail } from './Feature/StudentDetail';
import { SurveyAnalytics } from './Feature/SurveyAnalytics';
import { UploadSurvey } from './Feature/UploadSurvey';
import { AdminSurvey } from './Feature/AdminSurvey';

import './App.css';

export default function App(): JSX.Element {
  return (
    <Router>
      <div>
        <Header />

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/login"> <Login /> </Route>
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
  );
}
