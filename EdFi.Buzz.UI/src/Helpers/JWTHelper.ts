import fetch from 'node-fetch';
import * as jwkToPem from 'jwk-to-pem';
import * as jwt from 'jsonwebtoken';

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

export default class JWTHelper {
    // eslint-disable-next-line
    async getJsonData<T>(url: string): Promise<T> {
        return fetch(url).then((response) => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.json() as Promise<T>;
        });
    }

    // eslint-disable-next-line
    async createPem(token: string): Promise<string> {
        try {
            const uriDiscoDoc: UriDisco = await this.getJsonData<UriDisco>(
                process.env.REACT_APP_URI_DISCOVERY
            );
            if (uriDiscoDoc === null) {
                throw new Error(
                    'Uri Discovery document could not be retrieved'
                );
            }

            // eslint-disable-next-line
            const jwks: UriJwks = await this.getJsonData<UriJwks>(
                uriDiscoDoc.jwks_uri
            );
            if (jwks === null) {
                throw new Error('JSON Web Key Store could not be retrieved');
            }

            const decodedToken: JwtToken = jwt.decode(token, {
                complete: true,
                json: true,
            }) as JwtToken;
            if (decodedToken === null) {
                throw new Error('Invalid token');
            }

            const keyId = decodedToken?.header?.kid;

            if (keyId === null) {
                throw new Error('The key ID for the token was not found');
            }

            const jwk = jwks.keys.filter((k) => k.kid === keyId)[0];

            return jwkToPem({ n: jwk.n, kty: jwk.kty, e: jwk.e });
        } catch (err) {
            console.error(`createPem ERROR: ${err} - ${err.detail}`);
        }
    }

    // eslint-disable-next-line
    public async validateToken(token: string): Promise<boolean | object> {
        try {
            const pem = await this.createPem(token);
            return !!jwt.verify(token, pem);
        } catch (err) {
            console.error(`validateToken ERROR: ${err} - ${err.detail}`);
            return false;
        }
    }
}
