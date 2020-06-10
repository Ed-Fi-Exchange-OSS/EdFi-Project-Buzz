import React, { FunctionComponent, useState, useEffect } from 'react';
import { Container, Row, Col, CardDeck, Card } from 'react-bootstrap';
import { StudentDetailGuardianType } from './types/StudentDetailGuardianType';
import { StudentDetailSiblingType } from './types/StudentDetailSiblingType';
import { StudentDetailType, StudentDetailSurveyType } from './types/StudentDetailTypes';
import StudentGuardianContainer from './StudentGuardianContainer';
import StudentSiblingContainer from './StudentSiblingContainer';
import allStudents from './mockData/mockedStudents';
import ErrorMessage from '../utilities/ErrorMessage';
import { StudentDetailProps } from './StudentDetailProps';
import StudentSurveyContainer from './StudentSurveyContainer';
import ProfilePic from '../utilities/ProfilePic';

const StudentDetail: FunctionComponent<StudentDetailProps> = ({ match }) => {
  const [student, setStudent] = useState<StudentDetailType | undefined>(undefined);

  const header = {
    padding: '25px 10px',
  };

  const surveyStyle = {
    padding: '25px 12px',
  };

  useEffect(() => {
    const ourStudent = allStudents.filter((s) => s.id === match.params.id)[0];
    setStudent(ourStudent);
  }, [match.params.id]);

  return student && student !== undefined ? (
    <Container fluid>
      <Row style={header}>
        <Col>
          <h1>{`Student Detail - ${student.firstName} ${student.lastName}`}</h1>
          <hr />
        </Col>
      </Row>
      <Row>
        <Col style={{ display: 'flex', flexWrap: 'wrap' }}>
          <div style={{ flex: 1 }}>
            <Card
              key={student.id}
              style={{
                flex: '1',
                border: 'none',
                minWidth: '21rem',
                maxWidth: '21rem',
                padding: '5px 5px',
                margin: '10px 10px',
              }}
            >
              <Card.Body style={{ display: 'flex' }}>
                <div
                  style={{
                    flex: 1,
                    margin: '2px 2em 2px 2px',
                  }}
                >
                  <ProfilePic pictureUrl={student.pictureurl} />
                </div>
                <div style={{ flex: 4 }}>
                  <div>{student.email}</div>
                  <div>Student ID: {student.id}</div>
                </div>
              </Card.Body>
            </Card>
          </div>
          <div style={{ flex: 1 }}>
            <CardDeck>
              {student.guardians.map((value: StudentDetailGuardianType) => (
                <StudentGuardianContainer
                  key={value.id}
                  id={value.id}
                  firstName={value.firstName}
                  lastName={value.lastName}
                  phone={value.phone}
                  address={value.address}
                  pictureurl={value.pictureurl}
                  relationship={value.relationship}
                  isPrimary={value.isPrimary}
                />
              ))}
            </CardDeck>
          </div>
        </Col>
      </Row>
      <Row
        style={{
          padding: '25px 12px 0px 12px',
        }}
      >
        {student.siblings && student.siblings.length > 0 ? (
          <Container fluid>
            <Row>
              <Col>
                <h5>Siblings</h5>
              </Col>
            </Row>
            <Row
              style={{
                border: '1px solid black',
                padding: '10px 10px',
              }}
            >
              <Col xs={12}>
                <CardDeck>
                  {student.siblings.map((value: StudentDetailSiblingType) => (
                    <Col key={value.id} xs={12} sm={12} md={6} lg={4} xl={4}>
                      <StudentSiblingContainer
                        key={value.id}
                        id={value.id}
                        firstName={value.firstName}
                        lastName={value.lastName}
                        gradeLevel={value.gradeLevel}
                        school={value.school}
                        pictureurl={value.pictureurl}
                      />
                    </Col>
                  ))}
                </CardDeck>
              </Col>
            </Row>
          </Container>
        ) : (
          <div />
        )}
      </Row>
      {student.surveys && student.surveys.length > 0 ? (
        <Row style={surveyStyle}>
          <Col>
            <CardDeck>
              {student.surveys.map(({ id, name, questions, date }: StudentDetailSurveyType) => (
                <StudentSurveyContainer key={id} id={id} name={name} questions={questions} date={date} />
              ))}
            </CardDeck>
          </Col>
        </Row>
      ) : (
        <div />
      )}
    </Container>
  ) : (
    <ErrorMessage message={`There is no student with an ID of '${match.params.id}'`} />
  );
};

export default StudentDetail;
