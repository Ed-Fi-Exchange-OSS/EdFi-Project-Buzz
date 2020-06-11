import React, { FC } from 'react';
import { CardDeck } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import StudentCard from './StudentCard';
import { StudentClassType } from './types/StudentClassType';
import { StudentRosterProps } from './types/StudentRosterProps';

const StudentRoster: FC<StudentRosterProps> = (props: StudentRosterProps) => {
  const { students } = props;

  const deck =
    students && students.length > 0 ? (
      students.map((s: StudentClassType) => (
        <Col key={s.studentschoolkey} xs={12} sm={12} md={6} lg={6} xl={4}>
          <StudentCard
            studentSchoolKey={s.studentschoolkey}
            studentFirstName={s.studentfirstname}
            studentLastName={s.studentlastname}
            email={s.email}
            pictureurl={s.pictureurl}
            guardianInformation={s.guardianInformation}
            hasAccessToGoogleClassroom={s.hasAccessToGoogleClassroom}
            hasPhone={s.hasPhone}
            hasInternetAccess={s.hasInternetAccess}
            hasEmail={s.hasEmail}
          />
        </Col>
      ))
    ) : (
      <div />
    );

  return <CardDeck>{deck}</CardDeck>;
};

export default StudentRoster;
