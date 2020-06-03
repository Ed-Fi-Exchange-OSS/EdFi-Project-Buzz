import React, { useState, useCallback } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import PageHeader from './pageHeader';
import StudentRoster from '../Student/StudentRoster';
import { StudentClassType } from '../Student/types/StudentClassType';
import { TeacherHeaderType } from './types/TeacherHeaderType';

import TeacherHeaderData from './mockData/HeaderData';
import studentsList from './mockData/StudentRoster';

const headerData: TeacherHeaderType = TeacherHeaderData;
const originalRoster: {
  '1': Array<StudentClassType>;
  '2': Array<StudentClassType>;
} = studentsList;
const teacherName = `${headerData.firstname} ${headerData.middlename} ${headerData.lastsurname}`;

const TeacherScreen: React.FunctionComponent = () => {
  const [sectionKey, setSectionKey] = useState<string>('');
  const [rosterData, setRosterData] = useState<Array<StudentClassType>>([]);

  const onSectionChange = useCallback(
    (evt: string) => {
      setSectionKey(evt);
      let roster: Array<StudentClassType> = [];
      if (sectionKey) {
        roster = sectionKey === '1' ? originalRoster['1'] : originalRoster['2'];
      }
      setRosterData(roster);
    },
    [sectionKey],
  );

  return (
    <div>
      <Row>
        <Col xs={12}>
          <PageHeader TeacherClass={headerData.sections} TeacherName={teacherName} onClassChange={onSectionChange} />
          <hr />
        </Col>
      </Row>
      <div className="detailArea">
        <StudentRoster students={rosterData} />
      </div>
    </div>
  );
};

export default TeacherScreen;
