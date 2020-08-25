// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import getClaims from '../services/jwt.service';

const CurrentUser = createParamDecorator((data: unknown, context: ExecutionContext) => {
  const [, , { req }] = context.getArgs();
  const userData = getClaims(req.headers.authorization);
  const email = userData.email || userData.upn;
  return email;
});

export default CurrentUser;
