/*
 * SPDX-License-Identifier: Apache-2.0
 * Licensed to the Ed-Fi Alliance under one or more agreements.
 * The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
 * See the LICENSE and NOTICES files in the project root for more information.
 */

import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
const OLD_ENV = process.env;

beforeEach(() => {
    jest.resetModules(); // most important - it clears the cache
    process.env = { ...OLD_ENV }; // make a copy
});

afterAll(() => {
    process.env = OLD_ENV; // restore old env
});

describe('', () => {
    const OLD_ENV = {};

    beforeEach(() => {});

test('test test', () => {
        const app = render(<App />);
        expect(app).toBeDefined();
    });
});
