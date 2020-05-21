import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders Welcome text', () => {
  const { getByText } = render(<App />);
  const textElement = getByText(/Welcome To Fix it Fridays/i);
  expect(textElement).toBeInTheDocument();
});
