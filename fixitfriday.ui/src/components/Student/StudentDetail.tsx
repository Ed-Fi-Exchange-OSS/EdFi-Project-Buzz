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

  useEffect(() => {
    const ourStudent = allStudents.filter((s) => s.id === match.params.id)[0];
    setStudent(ourStudent);
  }, [match.params.id]);

  return student && student !== undefined ? (
    <Container fluid className="student-detail-container">
      <Row className="section-container student-detail-container-header">
        <Col>
          <span className="bigger-bold-text">{`Student Detail - ${student.firstName} ${student.lastName}`}</span>
          <hr />
        </Col>
      </Row>
      <Row className="section-container">
        <Col className="student-detail-container-body">
          <div className="student-detail-student-info-container">
            <Card key={student.id} className="student-detail-student-info-card">
              <Card.Body className="student-detail-student-info-card-profilepic">
                <div>
                  <ProfilePic pictureUrl={student.pictureurl} />
                </div>
                <div className="student-detail-student-info-card-info">
                  <div>{student.email}</div>
                  <div>Student ID: {student.id}</div>
                </div>
              </Card.Body>
            </Card>
          </div>
          <div className="student-detail-guardians-container" style={{ flex: 1 }}>
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
      {student.siblings && student.siblings.length > 0 ? (
        <Row className="section-container student-detail-survey-container">
          <Container fluid className="bordered-container-label">
            <Row>
              <Col sm={3} className="bold-text">
                Siblings
              </Col>
              <Col sm={6} />
              <Col sm={3} />
            </Row>
          </Container>
          <Container fluid className="bordered-container-with-label">
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
          </Container>
        </Row>
      ) : (
        <div />
      )}
      {student.surveys && student.surveys.length > 0 ? (
        <Row className="section-container student-detail-survey-container">
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
