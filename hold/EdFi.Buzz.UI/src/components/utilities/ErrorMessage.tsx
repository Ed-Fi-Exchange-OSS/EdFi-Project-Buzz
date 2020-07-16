// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import React, { FunctionComponent } from 'react';
import { Alert } from 'react-bootstrap';

type ErrorMessageProps = {
  message: string;
};

const ErrorMessage: FunctionComponent<ErrorMessageProps> = ({ message }) => {
  return (
    <Alert variant="danger">{message && message !== null ? message : 'An error has occurred processing the request.'}</Alert>
  );
};

export default ErrorMessage;
