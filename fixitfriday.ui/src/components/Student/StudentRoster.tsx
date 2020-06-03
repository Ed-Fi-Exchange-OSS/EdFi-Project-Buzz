import React, { FC } from 'react';
import { CardDeck } from 'react-bootstrap';
import StudentCard from './StudentCard';
import { StudentClassType } from './types/StudentClassType';
import { StudentRosterProps } from './types/StudentRosterProps';

const StudentRoster: FC<StudentRosterProps> = (props: StudentRosterProps) => {
  const { students } = props;

  const deck =
    students && students.length > 0 ? (
      students.map((s: StudentClassType) => (
        <StudentCard
          key={s.studentschoolkey}
          studentSchoolKey={s.studentschoolkey}
          studentFirstName={s.studentfirstname}
          studentLastName={s.studentlastname}
          email="TODO: NO EMAIL YET"
          pictureurl={s.pictureurl}
        />
      ))
    ) : (
      <div />
    );

  return (
    <>
      <CardDeck className="studentCard" style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
        {deck}
      </CardDeck>
    </>
  );
};

export default StudentRoster;
