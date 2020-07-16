// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import React from 'react';
import { Button, Form, FormControl, Nav, Navbar } from 'react-bootstrap';
import logo from '../../logo.png';

const EdFiNavBar: React.FC = () => (
  <Navbar>
    <Navbar.Brand href="/">
      <img alt="Ed-Fi logo" src={logo} />
    </Navbar.Brand>
    <Navbar.Collapse>
      <Nav className="mr-auto">
        <Nav.Link href="/">Home</Nav.Link>
      </Nav>
      <Form inline className="d-none d-lg-block">
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
