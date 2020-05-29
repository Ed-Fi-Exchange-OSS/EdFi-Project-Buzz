import React, { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useQuery } from '@apollo/react-hooks';

import PageHeader from './pageHeader';
import GET_TEACHER_NAME_AND_SECTIONS from '../../GraphQl/teacher/teacherQueries';
import StudentRoster from '../Student/StudentRoster';
import { StudentClassType } from '../Student/types/StudentClassType';
import GET_STUDENTS_FOR_SECTION from '../../GraphQl/students/studentQueries';
import ErrorMessage from '../utilities/ErrorMessage';
import LoadingMessage from '../utilities/LoadingMessage';

const TeacherScreen: React.FunctionComponent = () => {
  const [sectionKey, setSectionKey] = useState('9');

  const onSectionChange = (evt: any) => {
    setSectionKey(evt);
  };

  const { loading: headerLoading, error: headerError, data: headerData } = useQuery(GET_TEACHER_NAME_AND_SECTIONS, {
    variables: { StaffKey: 1 },
  });

  const { loading: rosterLoading, error: rosterError, data: rosterData } = useQuery(GET_STUDENTS_FOR_SECTION, {
    variables: { key: sectionKey },
  });

  let Header = <LoadingMessage />;
  if (headerLoading) {
    Header = <LoadingMessage />;
  } else if (headerError) {
    Header = <ErrorMessage />;
  } else {
    const teacherName = `${headerData.sectionsbystaff.firstname} ${headerData.sectionsbystaff.middlename} ${headerData.sectionsbystaff.lastsurname}`;
    Header = (
      <PageHeader
        TeacherClass={headerData.sectionsbystaff.sections}
        TeacherName={teacherName}
        onClassChange={onSectionChange}
      />
    );
  }

  let Detail = <LoadingMessage />;
  if (rosterLoading) {
    Detail = <LoadingMessage />;
  } else if (rosterError) {
    Detail = <ErrorMessage />;
  } else {
    let studentData: Array<StudentClassType> = rosterData.studentsbysection.map((c: any) => c.student);
    Detail = <StudentRoster students={studentData} />;
  }

  return (
    <div>
      <Row>
        <Col xs={12}>
          {Header}
          <hr />
        </Col>
      </Row>
      <div className={'detailArea'}>{Detail}</div>
    </div>
  );
};

export default TeacherScreen;
