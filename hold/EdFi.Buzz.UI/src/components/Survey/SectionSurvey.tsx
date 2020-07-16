// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import React, { FC, useState, useEffect, useCallback } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { useHistory, Link } from 'react-router-dom';
import PageHeader from '../teacher-screen/pageHeader';
import { SectionSurveyProps } from './types/SectionSurveyProps';
import { TeacherHeaderType } from '../teacher-screen/types/TeacherHeaderType';
import TeacherHeaderData from '../teacher-screen/mockData/HeaderData';
import SectionSurveyResultsData from './mockData/SectionSurveyResultsData';
import SectionSurveyGrid from './SectionSurveyGrid';
import { SurveyResultsType } from './types/SurveyResultsType';

const SectionSurvey: FC<SectionSurveyProps> = ({ match }) => {
  const [sectionSurveyData, setSectionSurveyData] = useState<SurveyResultsType | undefined>(undefined);
  const history = useHistory();
  const headerData: TeacherHeaderType = TeacherHeaderData;
  const teacherName = `${headerData.firstname} ${headerData.middlename} ${headerData.lastsurname}`;

  useEffect(() => {
    const sectionSurveyDefinition = SectionSurveyResultsData.surveydefinition.filter(
      s => s.surveykey === match.params.survey,
    )[0];
    const sectionSurveyResults = SectionSurveyResultsData.surveyresults?.filter(
      s =>
        (match.params.section.toLowerCase() === 'all' || s.sectionkey === match.params.section) &&
        s.surveykey === match.params.survey,
    );
    if (sectionSurveyDefinition && sectionSurveyDefinition !== undefined) {
      setSectionSurveyData({
        surveydefinition: sectionSurveyDefinition,
        answers: sectionSurveyResults && sectionSurveyResults !== undefined ? sectionSurveyResults : [],
      });
    }
  }, [match.params.survey, match.params.section]);

  const onSectionChange = useCallback(
    (evt: string) => {
      if (evt !== match.params.section) {
        const section = evt && evt !== '' ? evt : 'all';
        history.push(`/sectionsurvey/${section}/${match.params.survey}`);
      }
    },
    [history, match.params.section, match.params.survey],
  );

  return (
    <Row>
      <Col xs={12}>
        <PageHeader
          TeacherClass={headerData.sections}
          TeacherName={teacherName}
          SelectedClass={match.params.section.toLowerCase() !== 'all' ? match.params.section : ''}
          ShowAllOption
          onClassChange={onSectionChange}
        />
        <hr />
      </Col>
      <Col xs={12}>
        {sectionSurveyData &&
        sectionSurveyData !== undefined &&
        sectionSurveyData.surveydefinition &&
        sectionSurveyData.surveydefinition !== undefined ? (
          <h1>{sectionSurveyData.surveydefinition.surveyname}</h1>
        ) : (
          <h1>&nbsp;</h1>
        )}
      </Col>
      <Col xs={12}>
        <div id="classRoster" style={{ float: 'right' }}>
          <Link to="/">
            <Button variant="primary">Class Roster</Button>
          </Link>
          &nbsp; &nbsp;
          <Link to="/AdvancedSearch">
            <Button variant="primary">Advanced Search</Button>
          </Link>
          <br />
          <br />
        </div>
      </Col>
      <Col xs={12}>
        {sectionSurveyData && sectionSurveyData !== undefined ? (
          <SectionSurveyGrid surveyresult={sectionSurveyData} />
        ) : (
          <div />
        )}
      </Col>
    </Row>
  );
};
export default SectionSurvey;
