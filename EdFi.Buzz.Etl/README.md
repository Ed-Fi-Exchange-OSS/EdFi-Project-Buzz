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
3. To configure the database, rename sample.env to .env and update the values to match your database configuration.

## How to run Survey ETL file directly in Node

For testing with the survey sample data:
    1. Use edfi.buzz.etl/surveySampleData/InsertSampleStudentData.sql to insert buzz.studentschool
    2. edfi.buzz.etl/surveySampleData/* are example csv's to import that have studentkeys references to surveySampleData/InsertSampleStudentData.sql.

```bash
$ cd edfi.buzz.etl
$ node ./src/surveyETL.js ./surveySampleData/InternetAccessSurvey.csv "Internet Access"
```

## How to run a Graphile Worker as a service to load Surveys

Graphile Worker allows the ETL to run as a service. It will watch the graphile-worker jobs table for new jobs. The initial execution creates the required database schema objects needed to manage jobs. In production, the Project Buzz API will manage creating new survey jobs to process. Use the testing step below to add an individual survey for processing.

```bash
$ cd edfi.buzz.etl
$ npx graphile-worker -c "postgres://user:password@database.url:port/edfi_buzz"
```

### Testing the Survey Runner task manually

The surveyRunner task can execute a survey job manuall. Run the following SQL and replace the example staffkey,  survey name and file path location.
Once the graphile-worker is running, add a job using the following SQL in the edfi_buzz PostgreSQL database.

```sql
SELECT graphile_worker.add_job('surveyLoader', json_build_object('staffkey', '1030', 'filename', 'Contact Survey', 'path', 'file://c/dev/some.file'), NULL,NULL,NULL,'asdklasdklasd');
```

The output should resemble the following:

```
$ npx graphile-worker -c "postgresql://postgres:pa55w0rd@localhost/edfi_buzz"
[core] INFO: Worker connected and looking for jobs... (task names: 'surveyLoader')
[job(worker-e7fec78d77f1c43645: surveyLoader{19})] INFO: Running the Survey loader for 1030 to load the Contact Survey located at file://c/dev/some.file
[worker(worker-e7fec78d77f1c43645)] INFO: Completed task 19 (surveyLoader) with success (0.76ms)
```

## How to run Database ETL

The database ETL module (./src/dbETL.js) is executed directly by node.

### PRECONDITIONS:

- You have created a .env file, or renamed the sample.env and edited it to match your configuration.
- You have a SQL Server install with an EdFi database with AMT views. If you want to load ODS only - update the - - BUZZ_SQLSOURCE value to 'ods' in your your .env file.
- You have a Postgres local database called Buzz. (Run db-migrate up in the database sub).

### Running the Database ETL

To run the database, navigate to the EdFi.Buzz.Etl directory, and execute ./src/dbEtl.js with node. Your output should look something like the following.

```powershell
PS C:\dev\Ed-Fi\Buzz\edfi.buzz.etl> node ./src/dbEtl.js
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
