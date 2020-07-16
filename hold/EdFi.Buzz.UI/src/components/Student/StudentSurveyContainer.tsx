// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import React, { FunctionComponent } from 'react';
import { Container, Row, Col, CardDeck, Card } from 'react-bootstrap';
import { StudentDetailSurveyType } from './types/StudentDetailTypes';
import { SurveyQuestionType } from '../Survey/types/SurveyQuestionType';

const StudentSurveyContainer: FunctionComponent<StudentDetailSurveyType> = ({ name, questions, date }) => {
  return (
    <>
      <Container fluid className="bordered-container-label">
        <Row>
          <Col sm={3} className="bold-text">
            {name}
          </Col>
          <Col sm={6} />
          <Col sm={3} className="student-detail-survey-container-timestamp">
            {date}
          </Col>
        </Row>
      </Container>
      <Container fluid className="bordered-container-with-label">
        <Row>
          <Col>
            <CardDeck>
              {questions.map((value: SurveyQuestionType) => (
                <Card className="no-border" key={value.id}>
                  <Card.Body>
                    <Card.Text className="bold-text">{`${value.question}:`}</Card.Text>
                    <Card.Text>{value.answer}</Card.Text>
                  </Card.Body>
                </Card>
              ))}
            </CardDeck>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default StudentSurveyContainer;
