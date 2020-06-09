import React from 'react';
import 'bootswatch/dist/flatly/bootstrap.min.css';
import './app.css';
import Container from 'react-bootstrap/Container';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import TeacherScreen from './components/teacher-screen/teacherScreen';
import StudentDetail from './components/Student/StudentDetail';
import SectionSurvey from './components/Survey/SectionSurvey';

import { Col, Nav, Row, Navbar, Form, FormControl, Button } from 'react-bootstrap';
import logo from './logo.png';

const NavBar = () => (
  <Navbar>
    <Navbar.Brand href="/">
      <img alt="Ed-Fi logo" src={logo} />
    </Navbar.Brand>
    <Navbar.Collapse>
      <Nav className="mr-auto">
        <Nav.Link href="/">Home</Nav.Link>
      </Nav>
      <Form inline>
        <FormControl type="text" placeholder="Search" className="mr-sm-2" />
        <Button variant="outline-success">Search</Button>
      </Form>
      <Nav>
        <Nav.Link href="/">Profile</Nav.Link>
        <Nav.Link href="/">Login</Nav.Link>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);

const App = () => (
  <Router>
    <main>
      <Container fluid>
        <Row>
          <Col sm={2}></Col>
          <Col sm={8} id="navbar-wrapper">
            <header>
              <NavBar />
            </header>
          </Col>
          <Col sm={2}></Col>
        </Row>
        <Row>
          <Col sm={2}></Col>
          <Col sm={8} id="page-content-wrapper">
            <Switch>
              <Route path="/" exact component={TeacherScreen} />
              <Route path="/teacher/:id" exact component={TeacherScreen} />
              <Route path="/student/:id" exact component={StudentDetail} />
              <Route path="/sectionsurvey/:section/:survey" exact component={SectionSurvey} />	      
            </Switch>
          </Col>
          <Col sm={2}></Col>
        </Row>
        <Row>
          <Col sm={2}></Col>
          <Col sm={8} className={'section-container'}>
            <div style={{ textAlign: 'center' }}>
              &copy;2020 Ed-Fi Alliance, LLC. All Rights Reserved. For the latest information about Ed-Fi visit our website
              at Ed-Fi.org.
            </div>
          </Col>
          <Col sm={2}></Col>
        </Row>
      </Container>
    </main>
  </Router>
);

export default App;
