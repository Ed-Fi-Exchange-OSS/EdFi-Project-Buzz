import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import './app.css';
import TeacherScreen from './components/teacher-screen/teacherScreen';
import StudentDetail from './components/Student/StudentDetail';
import SectionSurvey from './components/Survey/SectionSurvey';

const App = () => (
  <Container>
    <Router>
      <Switch>
        <Route path="/" exact component={TeacherScreen} />
        <Route path="/student/:id" exact component={StudentDetail} />
        <Route path="/sectionsurvey/:section/:survey" exact component={SectionSurvey} />
      </Switch>
    </Router>
  </Container>
);

export default App;
