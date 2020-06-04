import React, { FunctionComponent } from 'react';
import { Container, Row, Col, CardDeck, Card } from 'react-bootstrap';
import { StudentDetailSurveyType, SurveyQuestionType } from './types/StudentDetailTypes';

export const StudentSurveyContainer: FunctionComponent<StudentDetailSurveyType> = (props) => {

  let surveyContainer = {
    border : "1px solid black",
    padding: "10px 10px",
    marginBottom: "20px"
  }
  return (
    <Container fluid style={surveyContainer}>
      <Row>
        <Col>
          <h5>{props.name}</h5>
        </Col>
      </Row>
      <Row>
        <Col>
          <CardDeck>
            {props.questions.map((value: SurveyQuestionType) => (
              <Card style={{ border: 'none'}} key={value.id}>
                <Card.Body>
                  <Card.Text style={{ fontWeight: 'bold'}}>{`${value.question}:`}</Card.Text>
                  <Card.Text>{value.answer}</Card.Text>
                </Card.Body>
              </Card>
            ))}
          </CardDeck>
        </Col>
      </Row>
    </Container>
  );
};
