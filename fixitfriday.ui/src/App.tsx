import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';

import './app.css';
import TeacherScreen from './components/teacher-screen/teacherScreen';

const App = () => (
  <Container>
    <TeacherScreen />
  </Container>
);

export default App;
