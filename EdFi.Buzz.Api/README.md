# EdFi.Buzz.Api

## Description

GraphQL-based API for supporting the Ed-Fi Buzz solution.

## Installation

1. Download the repository.
2. Rename .env.example to .env. Choose URI_DISCOVERY to use either Google or Microsoft ADFS to verify the token.
3. Edit this file to configure your database access.
4. Install dependencies with `yarn install`.

## Running the app

```bash
# development
$ yarn start

# Open http://localhost:3000/ in a browser to verify

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

## TeamCity

Additional commands for TeamCity support

```bash
yarn test:ci
yarn lint:ci
```
