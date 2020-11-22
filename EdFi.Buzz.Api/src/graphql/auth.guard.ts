// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { validateToken } from '../helpers/JWTHelpers';

@Injectable()
export default class AuthGuard implements CanActivate {
  // eslint-disable-next-line class-methods-use-this
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context).getContext();
    const { request } = ctx;
    if (!request.headers.authorization) {
      return false;
    }

    ctx.user = await validateToken(request.headers.authorization);
    return true;
  }
}
