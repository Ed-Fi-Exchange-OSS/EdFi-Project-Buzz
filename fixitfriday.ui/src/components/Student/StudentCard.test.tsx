import React from 'react';
import { render } from '@testing-library/react';
import StudentCard from "./StudentCard";

test('renders Student Card', () => {
  const studentId = 26;
  const firstName = "Joe";
  const lastName = "Test";
  const email = "jtest@email.com";
  const { getByText } = render(<StudentCard studentId={studentId} firstName={firstName} lastName={lastName} email={email} />);
  const hasStudentId = getByText(`Student ID:${studentId}`);
  const hasName = getByText(`${firstName} ${lastName}`);
  const hasEmail = getByText(email);
  expect(hasStudentId).toBeTruthy();
  expect(hasName).toBeTruthy();
  expect(hasEmail).toBeTruthy();
});
