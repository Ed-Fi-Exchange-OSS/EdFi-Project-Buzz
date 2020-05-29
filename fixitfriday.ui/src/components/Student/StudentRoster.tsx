import React, { FC } from 'react';
import { CardDeck } from 'react-bootstrap';
import StudentCard from './StudentCard';
import { StudentClassType } from './types/StudentClassType';
import { StudentRosterProps } from './types/StudentRosterProps';

const StudentRoster: FC<StudentRosterProps> = (props: StudentRosterProps) => {
  const students = props.students;

  const deck =
    students && students.length > 0 ? (
      students.map((s: StudentClassType, i: Number) => (
        <StudentCard
          key={s.studentschoolkey}
          studentSchoolKey={s.studentschoolkey}
          studentFirstName={s.studentfirstname}
          studentLastName={s.studentlastname}
          email={'TODO: NO EMAIL YET'}
          pictureurl={s.pictureurl}
        />
      ))
    ) : (
      <div></div>
    );

  return (
    <React.Fragment>
      <CardDeck className={'studentCard'} style={{ display: 'flex', flexDirection: 'row', width:'100%' }}>
        {deck}
      </CardDeck>
    </React.Fragment>
  );
};

export default StudentRoster;
