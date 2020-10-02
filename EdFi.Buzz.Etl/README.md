# Ed-Fi Buzz - ETL

These scripts were made possible thanks to the Ed-Fi Alliance and the Michael and Susan Dell Foundation.

## Description

This application provides two ETL modules to load Google Form Survey data to the Buzz database, and to port data from the ODS data sources to Postgres.

## Prerequisites

We recommend that the following prerequisites are installed on the machine that you are going to run the scripts on.

1. Node Js LTS version https://nodejs.org/en/
2. Postgresql

That is it =)

## Setup Instructions for ETL

1. Download the repository.
2. Install dependencies with `yarn install`.
3. To configure the database, rename .env.example to .env and update the values to match your database configuration.

## Executing Survey Loader as a service to load files

Graphile Worker allows the Survey Loader  to run as a service. It will watch the graphile-worker jobs table in the edfi_buzz database for new jobs. The initial execution creates the required database schema objects needed to manage jobs. In production, the Project Buzz API will manage creating new survey jobs to process. Use the testing step below to add an individual survey for processing.

The ETL Survey Loader can run as a service using the `yarn start:survey` task.

```bash
$ cd edfi.buzz.etl
$ yarn start:survey
```

## Executing Contact Information Loader as an executable service.

This ETL contains an executor to load the preferred contact method and the best time to contact. 
These 2 fields don't exist in ODS, and that is why we need this service.

In order to execute this service you need to provide it with a csv file with the following format:
```sh
ContactPersonKey,PreferredContactMethod,BestTimeToContact
Some_ContactPersonKey,Some_PreferredContactMethod,SomeBestTimeToContact
...
```

It's important to mention that Some_ContactPersonKey should represent a real Contact Person Key in the database.

Once the csv file has been properly formatted and saved, you can execute the service with this command:

```bash
$ cd edfi.buzz.etl
$ node .\src\ContactInfoImporter\buzzContactInfo.js <filename>
```

## Running the Database Loader

The ETL Database module (./src/dbETL.js) is executed by yarn via the start:db task, or directly by node.

### PRECONDITIONS:

- You have created a .env file, or renamed the sample.env and edited it to match your configuration.
- You have a SQL Server install with an EdFi database with AMT views. If you want to load ODS only - update the - BUZZ_SQLSOURCE value to 'ods' in your your .env file.
- Additionally the installer assumes, by default, that ODS contains data standard 3. To change this value to use DS2, just change BUZZ_DB_DS value to 'ds2'.
- You have a Postgres local database called Buzz. (Run db-migrate up in the database sub).

### Running the Database Loader

To run the database, navigate to the EdFi.Buzz.Etl directory, and execute `yarn start:db`. Alternatively, you can run the `./src/dbEtl.js` file directly with node.

Your output should look something like the following.

```powershell
PS C:\dev\Ed-Fi\Buzz\edfi.buzz.etl> yarn start:db
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

> NOTE: You will need a .env file in the Edfi.Buzz.Etl directory with the following parameters. As mentioned above, you should rename the sample.env to .env, and change any database names user names, ports or passwords that do not match your local configuration.

> IMPORTANT: BUZZ_SQLSOURCE values should be either ods or amt. If you have Analytics Middle Tier with an analytics schema and views, it is recommended that you use amt for BUZZ_SQLSOURCE.

```bash
BUZZ_SQLSOURCE=amt
BUZZ_DBSERVER=127.0.0.1
BUZZ_PORT=5432
BUZZ_USER=postgres
BUZZ_PASSWORD=pa55w0rd
BUZZ_DBNAME=edfi_buzz
BUZZ_DB_DS=ds3
BUZZ_MAX=20
BUZZ_IDLETIMEOUTMILLIS=5000
BUZZ_CONNECTIONTIMEOUTMILLIS=2000
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
$ cd EdFi.Buzz.Etl
$ yarn start:db
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
