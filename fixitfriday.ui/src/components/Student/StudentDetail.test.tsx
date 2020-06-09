import React from 'react';
import { render } from '@testing-library/react';
import StudentDetail from './StudentDetail';
import allStudents from './mockData/mockedStudents';

test('renders Student Detail', () => {
  const query = allStudents;
  const student = query.filter((s) => s.id === '1')[0];
  const primaryGuardian = student.guardians[0];
  const secondGuardian = student.guardians[1];
  const thirdGuardian = student.guardians[2];

  const firstSurveyQuestion = student.surveys[0];

  const routeComponentPropsMock = {
    history: {} as any,
    location: {} as any,
    match: { params: { id: '1' } } as any,
  };

  const { getByText, getAllByText } = render(
    <StudentDetail
      history={routeComponentPropsMock.history}
      location={routeComponentPropsMock.location}
      match={routeComponentPropsMock.match}
    />,
  );
  const hasStudentId = getByText(`Student ID: ${student.id}`);
  const hasName = getByText(`Student Detail - ${student.firstName} ${student.lastName}`);
  const hasEmail = getByText(student.email);
  const hasPrimaryGuardianName = getByText(`${primaryGuardian.firstName} ${primaryGuardian.lastName}`);
  const hasPrimaryGuardianPhone = getByText(`${primaryGuardian.phone}`);
  const hasPrimaryGuardianAddress = getByText(`${primaryGuardian.address}`);
  const hasSecondGuardianName = getByText(`${secondGuardian.firstName} ${secondGuardian.lastName}`);
  const hasSecondGuardianPhone = getByText(`${secondGuardian.phone}`);
  const hasSecondGuardianAddress = getByText(`${secondGuardian.address}`);
  const hasThirdGuardianName = getByText(`${thirdGuardian.firstName} ${thirdGuardian.lastName}`);
  const hasThirdGuardianPhone = getByText(`${thirdGuardian.phone}`);
  const hasThirdGuardianAddress = getByText(`${thirdGuardian.address}`);
  const hasFirstSurveyName = getByText(`${firstSurveyQuestion.name}`);
  const hasFirstSurveyDate = getAllByText(firstSurveyQuestion.date);
  const hasFirstSurveyFirstQuestion = getByText(`${firstSurveyQuestion.questions[0].question}:`);
  const hasFirstSurveyFirstAnswer = getByText(`${firstSurveyQuestion.questions[0].answer}`);

  expect(hasFirstSurveyFirstAnswer).toBeTruthy();
  expect(hasFirstSurveyFirstQuestion).toBeTruthy();
  expect(hasFirstSurveyName).toBeTruthy();
  expect(hasFirstSurveyDate).toBeTruthy();

  expect(hasStudentId).toBeTruthy();
  expect(hasName).toBeTruthy();
  expect(hasEmail).toBeTruthy();
  expect(hasPrimaryGuardianName).toBeTruthy();
  expect(hasPrimaryGuardianPhone).toBeTruthy();
  expect(hasPrimaryGuardianAddress).toBeTruthy();
  expect(hasSecondGuardianName).toBeTruthy();
  expect(hasSecondGuardianPhone).toBeTruthy();
  expect(hasSecondGuardianAddress).toBeTruthy();
  expect(hasThirdGuardianName).toBeTruthy();
  expect(hasThirdGuardianPhone).toBeTruthy();
  expect(hasThirdGuardianAddress).toBeTruthy();
});
