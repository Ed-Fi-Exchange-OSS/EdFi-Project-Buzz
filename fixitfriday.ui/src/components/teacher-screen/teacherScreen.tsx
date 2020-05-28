import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useQuery } from '@apollo/react-hooks';

import PageHeader from './pageHeader';
import GET_TEACHER_NAME_AND_SECTIONS from '../../GraphQl/teacher/teacherQueries';

const TeacherScreen: React.FunctionComponent = () => {
  const { loading: headerLoading, error: headerError, data: headerData } = useQuery(GET_TEACHER_NAME_AND_SECTIONS, {
    variables: { StaffKey: 1 },
  });

  let Header = <p>Loading...</p>;
  if (headerLoading) {
    Header = <p>Loading...</p>;
  } else if (headerError) {
    Header = <p>An error has ocurred processing the request.</p>;
  } else {
    const teacherName = `${headerData.sectionsbystaff.firstname} ${headerData.sectionsbystaff.middlename} ${headerData.sectionsbystaff.lastsurname}`;
    Header = <PageHeader TeacherClass={headerData.sectionsbystaff.sections} TeacherName={teacherName} />;
  }

  return (
    <Row>
      <Col xs={12}>
        {Header}
        <hr />
      </Col>
    </Row>
  );
};

export default TeacherScreen;
