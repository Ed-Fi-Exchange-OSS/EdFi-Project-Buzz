import React, { useState, useCallback } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import PageHeader from './pageHeader';
import StudentRoster from '../Student/StudentRoster';
import SurveyRoster from '../Survey/SurveyRosterModal';
import { StudentClassType } from '../Student/types/StudentClassType';
import { SurveyClassType } from '../Survey/types/SurveyClassType';
import { TeacherHeaderType } from './types/TeacherHeaderType';

import TeacherHeaderData from './mockData/HeaderData';
import studentsList from './mockData/StudentRoster';
import surveysList from './mockData/SurveyRoster';

const headerData: TeacherHeaderType = TeacherHeaderData;
const originalRoster: {
  '1': Array<StudentClassType>;
  '2': Array<StudentClassType>;
} = studentsList;
const surveyRoster: {
  '1': Array<SurveyClassType>;
  '2': Array<SurveyClassType>;
} = surveysList;

const teacherName = `${headerData.firstname} ${headerData.middlename} ${headerData.lastsurname}`;

const TeacherScreen: React.FunctionComponent = () => {
  const [sectionKey, setSectionKey] = useState<string>('');
  const [rosterData, setRosterData] = useState<Array<StudentClassType>>([]);
  const [surveyRosterData, setSurveyRosterData] = useState<Array<SurveyClassType>>([]);

  const onSectionChange = useCallback(
    (evt: string) => {
      setSectionKey(evt);
      let roster: Array<StudentClassType> = [];
      let surveySectionRoster: Array<SurveyClassType> = [];
      if (sectionKey) {
        roster = sectionKey === '1' ? originalRoster['1'] : originalRoster['2'];
        surveySectionRoster = sectionKey === '1' ? surveyRoster['1'] : surveyRoster['2'];
      }
      setRosterData(roster);
      setSurveyRosterData(surveySectionRoster);
    },
    [sectionKey],
  );

  return (
    <>
      <Row className="section-container">
        <Col xs={12}>
          <PageHeader TeacherClass={headerData.sections} TeacherName={teacherName} onClassChange={onSectionChange} />
          <hr />
        </Col>
      </Row>
      <Row className="section-container">
        <Col xs={12}>
          <SurveyRoster surveys={surveyRosterData} />
        </Col>
        <Col xs={12}>
          <StudentRoster students={rosterData} />
        </Col>
      </Row>
    </>
  );
};

export default TeacherScreen;
