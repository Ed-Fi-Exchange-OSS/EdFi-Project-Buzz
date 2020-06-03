import React from 'react';
import { render } from '@testing-library/react';
import StudentDetail from './StudentDetail';

test('renders Student Detail', () => {
  const student = {
    id: '26',
    firstName: 'Joe',
    middleName: 'Q',
    lastName: 'Test',
    email: 'jtest@email.com',
    pictureUrl: 'asdfjkl;asdfjkl;asdfjkl;',
  };
  const primaryGuardian = {
    id: '1',
    firstName: 'Mother',
    lastName: 'Test',
    phone: '512-555-1212',
    address: '124 Main St, Austin, TX, USA 78705',
  };
  const secondGuardian = {
    id: '2',
    firstName: 'Father',
    lastName: 'Test',
    phone: '512-555-3434',
    address: '123 Main St, Austin, TX, USA 78705',
  };
  const thirdGuardian = {
    id: '3',
    firstName: 'Grandma',
    lastName: 'Test',
    phone: '512-555-5656',
    address: '498 Oak Dr, Austin, TX, USA 78745',
  };
    const { getByText } = render(
    <StudentDetail
      id={student.id}
      firstName={student.firstName}
      middleName={student.middleName}
      lastName={student.lastName}
      email={student.email}
      pictureurl={student.pictureUrl}
      guardians={[primaryGuardian, secondGuardian, thirdGuardian]}
    />,
  );
  const hasStudentId = getByText(`${student.id}`);
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
