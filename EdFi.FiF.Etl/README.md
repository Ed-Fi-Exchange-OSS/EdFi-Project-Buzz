# Fix It Fridays TOD - Teacher Observation Dashboards

These scripts were made possible thanks to the Ed-Fi Alliance and the Michael and Susan Dell Foundation.

## Description

This application provides two ETL modules to load Google Form Survey data to the FIF database, and to port data from the ODS data sources to Postgres.

## Prerequisites

We recommend that the following prerequisites are installed on the machine that you are going to run the scripts on.

1. Node Js LTS version https://nodejs.org/en/
2. Postgresql

That is it =)


## Setup Instructions for ETL

1. Download the repository.
2. Setup database using edfi.fif.database if needed (Edit its database.json config file and run `yarn migrate`).
3. Install dependencies with `npm install`.
4. To configure the database, rename sample.env to .env and update the values to match your database configuration.

> NOTE: Accepted FIF_SQLSOURCE values match the ./sql subdirectories - ods and amt.


## How to run Survey ETL

For testing with the survey sample data:
    1. Use edfi.fif.etl/surveySampleData/InsertSampleStudentData.sql to insert fif.studentschool
    2. edfi.fif.etl/surveySampleData/* are example csv's to import that have studentkeys references to surveySampleData/InsertSampleStudentData.sql.


```powershell
$ cd edfi.fif.etl
$ node ./src/surveyETL.js ./surveySampleData/InternetAccessSurvey.csv "Internet Access"
```

## How to run Database ETL

The database ETL module (./src/dbETL.js) is executed directly by node.

```powershell
$ cd edfi.fif.etl
$ node ./src/dbETL.js
```


## Legal Information

Copyright (c) 2020 Ed-Fi Alliance, LLC and contributors.

Licensed under the [Apache License, Version 2.0](LICENSE) (the "License").

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

See [NOTICES](NOTICES.md) for additional copyright and license notifications.
