import React from 'react';
import { Button, Form, FormControl, Nav, Navbar } from 'react-bootstrap';
import logo from '../../logo.png';

const EdFiNavBar = () => (
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

export default EdFiNavBar;
