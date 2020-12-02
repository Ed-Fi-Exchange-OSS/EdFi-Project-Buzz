// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.
import { HttpException, HttpStatus } from '@nestjs/common';
import { OAuth2Client, LoginTicket, TokenPayload } from 'google-auth-library';
import fetch from 'node-fetch';
import * as jwkToPem from 'jwk-to-pem';
import * as jwt from 'jsonwebtoken';

import { config } from 'dotenv';

config();

type UriDisco = {
  // eslint-disable-next-line
    jwks_uri: string;
};

type UriJwk = {
  kid: string;
  kty: string;
  n: string;
  e: string;
};

type UriJwks = {
  keys: Array<UriJwk>;
};

type JwtHeader = {
  kid?: string;
};

type JwtToken = {
  header?: JwtHeader;
};

export const getJsonData = async <T>(url:string): Promise<T> => fetch(url).then((response) => {
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return response.json() as Promise<T>;
});

export const createPem = async (token: string): Promise<string> => {
  const uriDiscoDoc: UriDisco = await getJsonData<UriDisco>(process.env.URI_DISCOVERY);
  if (uriDiscoDoc === null) {
    throw new Error('Uri Discovery document could not be retrieved');
  }

  // eslint-disable-next-line
      const jwks: UriJwks = await getJsonData<UriJwks>(uriDiscoDoc.jwks_uri);
  if (jwks === null) {
    throw new Error('JSON Web Key Store could not be retrieved');
  }

  const decodedToken: JwtToken = jwt.decode(token, { complete: true, json: true }) as JwtToken;
  if (decodedToken === null) {
    throw new Error('Invalid token');
  }

  const keyId = decodedToken?.header?.kid;

  if (keyId === null) {
    throw new Error('The key ID for the token was not found');
  }

  const jwk = jwks.keys.filter((k) => k.kid === keyId)[0];

  return jwkToPem({ n: jwk.n, kty: jwk.kty, e: jwk.e });
};

export const validateAdfsToken = async (token: string) => {
  const pem = await createPem(token);
  jwt.verify(token, pem);
  const decodedToken = jwt.decode(token, { complete: true, json: true });
  return decodedToken.payload;
};

export const validateGoogleToken = async (token: string) => {
  const client: OAuth2Client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  const ticket:LoginTicket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload: TokenPayload = ticket.getPayload();

  return payload;
};

export const getTokenFromHeader = async (auth: string): Promise<string> => {
  if (auth.split(' ')[0] !== 'Bearer') {
    throw new HttpException('No authorization header', HttpStatus.UNAUTHORIZED);
  }
  const token: string = auth.split(' ')[1];
  return token;
};

export const validateToken = async (auth: string): Promise<string|object> => {
  try {
    const token: string = await getTokenFromHeader(auth);

    const usesGoogle = (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_ID !== '');

    if (usesGoogle) {
      console.log('Using Google verification');
      return await validateGoogleToken(token);
    }
    console.log('Using ADFS verification');
    return await validateAdfsToken(token);
  } catch (err) {
    throw new HttpException(err.message, HttpStatus.UNAUTHORIZED);
  }
};
