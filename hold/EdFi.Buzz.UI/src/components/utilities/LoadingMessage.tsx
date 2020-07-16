// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import React, { SFC } from 'react';
import { Spinner } from 'react-bootstrap';

const LoadingMessage: SFC = () => {
  return (
    <Spinner animation="border" variant="info">
      <span className="sr-only">Loading...</span>
    </Spinner>
  );
};

export default LoadingMessage;
