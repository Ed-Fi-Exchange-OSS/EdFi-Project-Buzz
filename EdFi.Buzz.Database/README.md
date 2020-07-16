# Ed-Fi Buzz - Database

These scripts were made possible thanks to the Ed-Fi Alliance and the Michael and Susan Dell Foundation.

## Description

This application provides the scripts to create the database structures necessary to execute Ed-Fi Buzz

## Prerequisites

We recommend that the following prerequisites are installed on the machine that you are going to run the scripts on.

1. Node Js LTS version https://nodejs.org/en/
2. Postgresql

That is it =)

## Setup Instructions

1. Download the repository.
2. Rename .env.example to .env
3. Edit this file to configure your database access.
4. Install dependencies with `yarn install`.

## How to run

Just make sure the exists (the scripts assume the database exists) and then execute `yarn migrate`.

## Legal Information

Copyright (c) 2020 Ed-Fi Alliance, LLC and contributors.

Licensed under the [Apache License, Version 2.0](LICENSE) (the "License").

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

See [NOTICES](NOTICES.md) for additional copyright and license notifications.
