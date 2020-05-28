import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

const TestComponent = () => (
  <Container className="p-3">
    <Jumbotron>
      <Row className="justify-content-md-center">
        <h1 className="header">Welcome To Fix it Fridays</h1>
      </Row>
    </Jumbotron>
  </Container>
);

const App = () => <TestComponent />;

export default App;
