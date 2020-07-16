// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import React, { useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { SurveyDefinitionType } from '../types/SurveyDefinitionType';

type PageHeaderProps = {
  Surveys: Array<SurveyDefinitionType>;
  onSurveyChange?(value: string): void;
  onSurveyAvailabilityChange?(value: boolean): void;
};

const PageHeader: React.FunctionComponent<PageHeaderProps> = ({ Surveys, onSurveyChange, onSurveyAvailabilityChange }) => {
  const Options = Surveys.map(survey => (
    <option value={survey.surveykey} key={survey.surveykey}>
      {survey.surveyname}
    </option>
  ));

  const [selectedSurvey, setSelectedSurvey] = React.useState<string>('');

  const [checkedSurveyEnabled, setCheckedSurveyEnabled] = React.useState(true);
  const updateSurveyEnabled = () => setCheckedSurveyEnabled(!checkedSurveyEnabled);

  useEffect(() => {
    if (onSurveyChange) {
      onSurveyChange(selectedSurvey);
    }
  }, [selectedSurvey, onSurveyChange]);

  useEffect(() => {
    if (onSurveyAvailabilityChange) {
      onSurveyAvailabilityChange(checkedSurveyEnabled);
    }
  }, [checkedSurveyEnabled, onSurveyAvailabilityChange]);

  return (
    <>
      <Row>
        <Col>
          <h1>Surveys</h1>
        </Col>
      </Row>
      <Row>
        <Col xs={12} sm={12} md={6} lg={6} xl={6}>
          <Form>
            <Form.Group>
              <Form.Control as="select" value={selectedSurvey} size="sm" onChange={e => setSelectedSurvey(e.target.value)}>
                <option value="">Select a survey</option>
                {Options}
              </Form.Control>
            </Form.Group>
          </Form>
        </Col>
        <Col xs={12} sm={12} md={6} lg={6} xl={6} style={{ textAlign: 'right' }}>
          <Form hidden={!selectedSurvey}>
            <Form.Check
              type="switch"
              id={selectedSurvey}
              label="Survey availability"
              checked={checkedSurveyEnabled}
              onChange={updateSurveyEnabled}
            />
          </Form>
        </Col>
      </Row>
    </>
  );
};

export default PageHeader;
