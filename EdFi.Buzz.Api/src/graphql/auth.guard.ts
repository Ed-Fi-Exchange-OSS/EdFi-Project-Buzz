// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { CanActivate, ExecutionContext, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import fetch from 'node-fetch';
import * as jwkToPem from 'jwk-to-pem';
import * as jwt from 'jsonwebtoken';

import { config } from 'dotenv';

config();

type GoogleDisco = {
  // eslint-disable-next-line
    jwks_uri: string;
};

type GoogleJwk = {
  kid: string;
  kty: string;
  n: string;
  e: string;
};

type GoogleJwks = {
  keys: Array<GoogleJwk>;
};

type JwtHeader = {
  kid: string;
};

type JwtToken = {
  header: JwtHeader;
};

@Injectable()
export default class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context).getContext();
    if (!ctx.headers.authorization) {
      return false;
    }

    ctx.user = await this.validateToken(ctx.headers.authorization);
    return true;
  }

  // eslint-disable-next-line
   async getJsonData<T>(url: string): Promise<T> {
    return fetch(url).then(response => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json() as Promise<T>;
    });
  }

  // eslint-disable-next-line
  async createPem(token: string): Promise<string> {
    const googleDiscoDoc: GoogleDisco = await this.getJsonData<GoogleDisco>(process.env.GOOGLE_DISCOVERY);
    // eslint-disable-next-line
    const jwks: GoogleJwks = await this.getJsonData<GoogleJwks>(googleDiscoDoc.jwks_uri);
    const decodedToken: JwtToken = jwt.decode(token, { complete: true, json: true }) as JwtToken;
    const keyId = decodedToken.header.kid;
    const jwk = jwks.keys.filter(k => k.kid === keyId)[0];
    return jwkToPem({ n: jwk.n, kty: jwk.kty, e: jwk.e });
  }

  // eslint-disable-next-line
  async validateToken(auth: string): Promise<string|object> {
    if (auth.split(' ')[0] !== 'Bearer') {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    const token: string = auth.split(' ')[1];
    try {
      const pem = await this.createPem(token);
      return jwt.verify(token, pem);
    } catch (err) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }
}
