// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  Injectable, CanActivate, ExecutionContext, UnauthorizedException,
} from '@nestjs/common';
import StaffService from '../services/staff.service';
import getClaims from '../services/jwt.service';

@Injectable()
export default class ValidateStaffIdGuard implements CanActivate {
  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly staffService: StaffService) {}

  // eslint-disable-next-line class-methods-use-this
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const [, params, { req }] = context.getArgs();
    const userData = getClaims(req.headers.authorization);
    const errorMessage = 'You don\'t have access to execute this query or the parameters are not valid.';

    if (!userData) {
      throw new UnauthorizedException(errorMessage);
    }

    const res = await this.staffService.findOneByEmail(userData.email);
    if (!res || params.staffkey !== `${res.staffkey}`) {
      throw new UnauthorizedException(errorMessage);
    }

    return true;
  }
}
