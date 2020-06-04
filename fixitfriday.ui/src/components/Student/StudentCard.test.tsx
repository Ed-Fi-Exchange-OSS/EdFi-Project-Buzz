import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import StudentCard from './StudentCard';
import { GuardianInformationType } from './types/StudentClassType';

test('renders Student Card', () => {
  const studentSchoolKey = '26';
  const firstName = 'Joe';
  const lastName = 'Test';
  const email = 'jtest@email.com';
  const guardianInformation: GuardianInformationType = {
    name: 'Guardian Name',
    email: 'test@test.com',
    phone: '555-555-5555',
    address: 'Test Address',
    preferredContactMethod: 'Phone call',
    bestTimeToContact: 'Friday morning',
    relationship: 'Mother',
    contactNotes: 'Write a message before calling',
  };

  const { getByText, getAllByText } = render(
    <BrowserRouter>
      <StudentCard
        studentSchoolKey={studentSchoolKey}
        studentFirstName={firstName}
        studentLastName={lastName}
        pictureurl=""
        email={email}
        guardianInformation={guardianInformation}
      />
    </BrowserRouter>,
  );

  const hasStudentId = getByText(`Student ID: ${studentSchoolKey}`);
  const hasName = getByText(`${firstName} ${lastName}`);
  const hasEmail = getAllByText(email);
  const guardianHasAddress = getByText(guardianInformation.address);
  const guardianHasBestTimeToContact = getByText(guardianInformation.bestTimeToContact);
  const guardianHasContactNotes = getByText(guardianInformation.contactNotes);
  const guardianHasEmail = getAllByText(guardianInformation.email);
  const guardianHasNameAndRelationship = getByText(`${guardianInformation.name} (${guardianInformation.relationship})`);
  const guardianHasPhone = getByText(guardianInformation.phone);
  const guardianHasPreferredContactMethod = getByText(guardianInformation.preferredContactMethod);

  expect(hasStudentId).toBeTruthy();
  expect(hasName).toBeTruthy();
  expect(hasEmail).toBeTruthy();
  expect(guardianHasAddress).toBeTruthy();
  expect(guardianHasBestTimeToContact).toBeTruthy();
  expect(guardianHasContactNotes).toBeTruthy();
  expect(guardianHasEmail).toBeTruthy();
  expect(guardianHasNameAndRelationship).toBeTruthy();
  expect(guardianHasPhone).toBeTruthy();
  expect(guardianHasPreferredContactMethod).toBeTruthy();
});
