import React from 'react';
import 'bootswatch/dist/flatly/bootstrap.min.css';
import './app.css';
import Container from 'react-bootstrap/Container';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';

import EdFiNavBar from './components/Main/EdFiNavBar';
import EdFiFooter from './components/Main/EdFiFooter';
import TeacherScreen from './components/teacher-screen/teacherScreen';
import StudentDetail from './components/Student/StudentDetail';
import SectionSurvey from './components/Survey/SectionSurvey';
import AdvancedSearch from './components/Survey/AdvancedSearch';

const App = () => (
  <Router>
    <main>
      <Container fluid>
        <Row>
          <Col sm={2} />
          <Col sm={8} id="navbar-wrapper">
            <header>
              <EdFiNavBar />
            </header>
          </Col>
          <Col sm={2} />
        </Row>
        <Row>
          <Col sm={2} />
          <Col sm={8} id="page-content-wrapper">
            <Switch>
              <Route path="/" exact component={TeacherScreen} />
              <Route path="/teacher/:id" exact component={TeacherScreen} />
              <Route path="/student/:id" exact component={StudentDetail} />
              <Route path="/sectionsurvey/:section/:survey" exact component={SectionSurvey} />
              <Route path="/AdvancedSearch" exact component={AdvancedSearch} />
            </Switch>
          </Col>
          <Col sm={2} />
        </Row>
        <Row>
          <Col sm={2} />
          <Col sm={8} className="section-container">
            <EdFiFooter />
          </Col>
          <Col sm={2} />
        </Row>
      </Container>
    </main>
  </Router>
);

export default App;
