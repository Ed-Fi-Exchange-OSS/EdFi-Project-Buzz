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

## How to run Survey ETL

For testing with the survey sample data:
    1. Use edfi.fif.etl/surveySampleData/InsertSampleStudentData.sql to insert fif.studentschool
    2. edfi.fif.etl/surveySampleData/* are example csv's to import that have studentkeys references to surveySampleData/InsertSampleStudentData.sql.


```bash
$ cd edfi.fif.etl
$ node ./src/surveyETL.js ./surveySampleData/InternetAccessSurvey.csv "Internet Access"
```

## How to run Database ETL

The database ETL module (./src/dbETL.js) is executed directly by node.

### PRECONDITIONS:

- You have created a .env file, or renamed the sample.env and edited it to match your configuration.
- You have a SQL Server install with an EdFi database with AMT views. If you want to load ODS only - update the - - FIF_SQLSOURCE value to 'ods' in your your .env file.
- You have a Postgres local database called FixItFriday. (Run db-migrate up in the database sub).

### Running the Database ETL

To run the database, navigate to the EdFi.FiF.Etl directory, and execute ./src/dbEtl.js with node. Your output should look something like the following.

```powershell
PS C:\dev\Ed-Fi\Fix-It-Friday\edfi.fif.etl> node ./src/dbEtl.js
loading records from amt
[School] loading....
[School] Loaded records: 45
[School] done
[StudentSchool] loading....
[StudentSchool] Loaded records: 21028
[StudentSchool] done
[ContactPerson] loading....
[ContactPerson] Loaded records: 43275
[ContactPerson] done
[Section] loading....
[Section] Loaded records: 33550
[Section] done
[Staff] loading....
[Staff] Loaded records: 2848
[Staff] done
[StaffSection] loading....
[StaffSection] 22949 records deleted
[StaffSection] Loaded records: 22949
[StaffSection] done
[StudentSection] loading....
[StudentSection] 366739 records deleted
[StudentSection] Loaded records: 366739
[StudentSection] done
[StudentContact] loading....
[StudentContact] 35212 records deleted
[StudentContact] Loaded records: 35212
[StudentContact] done
finished loading entities
```

### .env File

> NOTE: You will need a .env file in the edfi.fif.etl directory with the following parameters. As mentioned above, you should rename the sample.env to .env, and change any database names user names, ports or passwords that do not match your local configuration.

> IMPORTANT: FIF_SQLSOURCE values should be either ods or amt. If you have Analytics Middle Tier with an analytics schema and views, it is recommended that you use amt for FIF_SQLSOURCE.

```bash
FIF_SQLSOURCE=amt
FIF_DBSERVER=127.0.0.1
FIF_PORT=5432
FIF_USER=postgres
FIF_PASSWORD=P@ssw0rd
FIF_DBNAME=FixItFriday
FIF_MAX=20
FIF_IDLETIMEOUTMILLIS=5000
FIF_CONNECTIONTIMEOUTMILLIS=2000
ODS_DBNAME=EdFi_Application
ODS_SERVER=localhost
ODS_USER=ods_user
ODS_PASSWORD=P@ssw0rd
ODS_PORT=1433
ODS_TRUSTSERVERCERTIFICATE=false
ODS_ENABLEARITHABORT=true
ODS_ENCRYPT=false
```

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
