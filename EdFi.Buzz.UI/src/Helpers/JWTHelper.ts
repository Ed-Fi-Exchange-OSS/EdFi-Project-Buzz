// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.
import { OAuth2Client, LoginTicket, TokenPayload } from 'google-auth-library';
import fetch from 'node-fetch';
import * as jwkToPem from 'jwk-to-pem';
import * as jwt from 'jsonwebtoken';
import { Environment } from 'Models';

interface UriDisco {
  // eslint-disable-next-line
    jwks_uri: string;
}

interface UriJwk {
  kid: string;
  kty: string;
  n: string;
  e: string;
}

interface UriJwks {
  keys: Array<UriJwk>;
}

interface JwtHeader {
  kid?: string;
}

interface JwtToken {
  header?: JwtHeader;
}

export const getJsonData = async <T>(url: string): Promise<T> => fetch(url).then((response) => {
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return response.json() as Promise<T>;
});

export const createPem = async (token: string, env: Environment): Promise<string> => {
  const uriDiscoDoc: UriDisco = await getJsonData<UriDisco>(env.URI_DISCOVERY);
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

export function isExpired(payload: TokenPayload): boolean {
  const dateNow = new Date();

  if(payload && payload.exp >= Math.round(dateNow.getTime()/1000)){
    return true;
  }
  return false;
}

export async function validateAdfsToken(token: string, environment: Environment): Promise<boolean> {
  if (environment.ID_PROVIDER !== 'adfs') {
    throw new Error('Invalid ID_PROVIDER usage');
  }
  const pem = await createPem(token, environment);
  jwt.verify(token, pem);
  const decodedToken = jwt.decode(token, { complete: true, json: true });
  return isExpired(decodedToken.payload);
}

export async function validateGoogleToken(token: string, environment: Environment): Promise<boolean> {
  if (environment.ID_PROVIDER !== 'google') {
    throw new Error('Invalid ID_PROVIDER usage');
  }
  const client: OAuth2Client = new OAuth2Client(environment.GOOGLE_CLIENT_ID);
  const ticket: LoginTicket = await client.verifyIdToken({
    idToken: token,
    audience: environment.GOOGLE_CLIENT_ID
  });

  const payload: TokenPayload = ticket.getPayload();
  return isExpired(payload);
}

export const validateToken = async (token: string, environment: Environment): Promise<boolean> => {
  try {
    switch (environment.ID_PROVIDER) {
      case 'google':
        return await validateGoogleToken(token, environment);
      case 'adfs':
        return await validateAdfsToken(token, environment);
      default:
        throw new Error(`Invalid ID_PROVIDER  ${environment.ID_PROVIDER}`);
    }
  } catch (err) {
    throw new Error(err.message);
  }
};
