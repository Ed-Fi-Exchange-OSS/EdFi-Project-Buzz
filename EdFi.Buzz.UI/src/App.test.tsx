/*
 * SPDX-License-Identifier: Apache-2.0
 * Licensed to the Ed-Fi Alliance under one or more agreements.
 * The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
 * See the LICENSE and NOTICES files in the project root for more information.
 */

import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

describe('App component test', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
    console.error = jest.fn();
    console.log = jest.fn();
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  test('App component should be defined', () => {
    const app = render(<App />);
    expect(app).toBeDefined();
  });
});
