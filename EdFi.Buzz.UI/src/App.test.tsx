import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('test test', () => {
  const app = render(<App />);
  expect(app).toBeDefined();
});
