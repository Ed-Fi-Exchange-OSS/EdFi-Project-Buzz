/*
 * SPDX-License-Identifier: Apache-2.0
 * Licensed to the Ed-Fi Alliance under one or more agreements.
 * The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
 * See the LICENSE and NOTICES files in the project root for more information.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ErrorBoundary from './Components/Error/ErrorBoundary';
import App from './App';
import {Spinner} from './Components/Spinner';

ReactDOM.render(
  <ErrorBoundary>
    <App />
    <Spinner/>
  </ErrorBoundary>, document.getElementById('root'));

