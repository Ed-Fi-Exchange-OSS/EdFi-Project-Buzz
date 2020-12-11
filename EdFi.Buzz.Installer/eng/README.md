# Project Buzz Installer

These scripts were made possible thanks to the Ed-Fi Alliance and the Michael and Susan Dell Foundation.

## Description

The installation script downloads all the assets needed for the Ed-Fi Buzz. Artifacts are placed in the dist/ directory at the root of this project

It validates existence of NuGet Package Provider, Node JS, IIS, SQL Server and Postgres. Retrieves the latest release of several Ed-Fi Buzz NuGet packages. Downloads prerequisites from the web.

The ETL requires a default, local instance of SQL Server, and the user executing the script must have sufficient permissions. Any existing Buzz databases on the build server should be backed-up and removed before running this build script.

## Installation
- **Database:** This application provides the scripts to create the database structures necessary to execute Ed-Fi Buzz.
- **ETL:** This application provides two ETL modules to load Google Form Survey data to the Buzz database, and to port data from the ODS data sources to Postgres.
- **API:** GraphQL-based API for supporting the Ed-Fi Buzz solution.
- **UI:** Project Buzz Web Application..

## Prerequisites

We recommend that the following prerequisites are installed on the machine that you are going to run the scripts on.

- Node Js LTS version https://nodejs.org/en/
- Postgresql
- IIS with the [Application Request Routing](https://www.iis.net/downloads/microsoft/application-request-routing) and [URL Rewrite](https://www.iis.net/downloads/microsoft/url-rewrite) modules, installed and configured per the documentation to provide request routing.
- [dotnet runtime 3.1.9](https://dotnet.microsoft.com/download/dotnet-core/thank-you/runtime-3.1.9-windows-x64-installer) is used by the Windows Service Wrapper ([winsw](https://github.com/winsw/winsw/))
- The [IIS URL Rewrite Module version 2.1](https://www.iis.net/downloads/microsoft/url-rewrite) provides routing for both IIS websites to support React as a single-page application (SPA) and for API's reverse proxy routes.
- [Application Request Routing version 3.0](https://www.microsoft.com/en-us/download/details.aspx?id=47333) is used by the API site for configuring reverse proxy routes in IIS.

## Setup Instructions
1. Choose a drive and root directory location. For our purposes, D:\Ed-Fi\Buzz will be used in examples.
1. Create your Buzz website in IIS. Configure SSL, certificates and port bindings. The Buzz UI web site would be installed to D:\Ed-Fi\Buzz\UI\build. Note the port (if other than https 443), and the location for the configuration (if different than the example) in step 2.
2. Edit the configuration file to include the values according to your installation environment.
3. Run as administrator the installation script.

### IIS Web site

Create a website for IIS per your internal procedures. For the configuration, note the install location and port. Configure the ARR and URL Rewrite modules for IIS from the link above. The installation will include a web.config to set up routes within the UI React application.

![IIS Web site](./images/iis-bindings-sm.png)

### Configuration file

The configuration variables for the installation are in the **'Windows\configuration.json'** file. In this file you can update the values to adapt them before the installation.

![installation](./images/configFile.png)

The variables that can be configured are detailed below.

#### General configuration

- **includePrerelease:** When true, allows NuGet to include pre-release NuGet packages as latest version. Recommended setting: false.
- **installPath:** The folder where Buzz apps are installed (C:\Ed-Fi\Buzz)
- **toolsPath:** The folder where Buzz downloads helper NuGet packages. (C:\temp\tools)
- **packagesPath:** The folder where Buzz downloads NuGet packages. (C:\temp\tools)
- **install[Database|Etl|Ui|Api]:** skips installation for apps marked false.
- **idProvider:** Authentication provider. Valid values: google, adfs.
- **googleClientId:** If the authentication provider is google, you must set in this field the corresponding googleClientId when you created the Web Application in Google Developers Console.
- **adfsClientId:** If the authentication is validated using adfs, you must include the clientId.
- **adfsTenantId:** If the authentication is validated using adfs, you must include the adfsTenantId.
- **loadSampleData:** Set to false in production; is for test purposes only.
- **keepSurveysSynch:** Set this value to true if you want the Buzz app surveys synchronized with ODS surveys.

#### postgresDatabase

You need to update the Postgres database connection string according to your configuration. You can configure the server, credentials or name to connect to the postgres database.

- **host:** Database server host name.
- **port:** Postgres port (E.g. 5432)
- **username:** User to connect to the database
- **password:** Password to connect to the database
- **database:** Database name. (e.g. "edfi_buzz")

#### sqlServerDatabase

You can configure the server, credentials or name to connect to the Sql Server ODS database.

- **host:** Sql Server name or IP.
- **port:** SQL database port.
- **username:** SQL Server database user name.
- **password:** SQL Server database.
- **database:** ODS database. AMT must be installed in this database.
- **UseIntegratedSecurity:** If you use integrated security. Allowed values: true, false.

#### etl

Options to configure the ETL to load from the database or file to the postgres database.

- **version:** The NuGet version to download. Blank gets latest.
- **datasourceFormat:** If the data source corresponds to the Analytics Middle Tier (amt) or direct views of the ODS tables. Allowed values: amt, ods.

#### api

- **version:** The NuGet version to download. Blank gets latest.
- **url:**  URL for the GraphQL endpoint setting in the UI env file.
- **port:** API port.
- **surveyFilesFolder** The folder into which uploaded survey files are written
- **corsOrigins** This is a comma-delimited list of URIs which require API access. CORS policy will reject any URIs not in this list. Include the protocol (http or https).
- **rejectTlsUnauthorized** true/false value to bypass the server certificate validation callback.
- **extraCaCerts** Comma-delimited list of file system paths to your organization's root CA certificates for that server. Export from your certificate store.

#### ui

- **version:** The NuGet version to download. Blank gets latest.
- **url:** Used to test the status code returned from the IIS configured Buzz UI website at the end of the install.
- **graphQlEndpoint:** The URI that the Buzz UI and users can use to access the API.
- **externalLogo:** If true, look for images in an external URL. If false, the images must have been copied into the 'assets' folder of the UI.
- **logo:** Login page logo URL.
- **logoWidth:** Logo max width with CSS size units ("25px").
- **title:** Site title.
- **titleLogo:** Site logo title to display in header URL.
- **titleLogoWidth:** Site logo title max width with CSS size units ("78px").
- **titleLogoHeight:** Site logo max height with CSS size units ("350px").

#### Change Privacy Policy page 
The privacy policy is included as a Markdown file and can be customized on the installed site.

To include a customized privacy policy page, you can replace the content of the **PRIVACY.POLICY.md** file with the content of your privacy policy. The file is in the web application folder (**C:\Ed-Fi\Buzz\UI\build\PRIVACY.POLICY.md**).

![Privacy Policy File](./images/privacyPolicy.png)

#### Change UI Web App icon (fav.ico)
To update the icon displayed in the browser, it is required to replace the fav.ico file with a valid icon file. You must copy the fav.ico that you want to use in the web application, in the public folder (**C:\Ed-Fi\Buzz\UI\build\fav.ico**).

![favico](./images/favico.png)

### Installation
Installation script requirements:
- A non-core PowerShell.
- $PSVersionTable.PSEdition is Desktop
- Run as Administrator. It requires administrator privileges.
- Configuration file. It receives the configPath Full path to a JSON document containing configuration settings for Buzz. Defaults to **.\configuration.json** in the same directory.

![configuration](./images/configurationJSON.png)

- The script will not run on PowerShell Core because WebAdministration does not load properly.

The installation script must be run in PowerShell as an administrator.

![installation](./images/install.png)

## Developer READMEs

Developer information for each Project Buzz application is outlined in a README within their respective root folders. The READMEs contain instructions for running the applications for debugging, or other tasks.

* [API - Developer README](../../EdFi.Buzz.Api/README.md)
* [Database -  Developer README](../../EdFi.Buzz.Database/README.md)
* [ETL -  Developer README](../../EdFi.Buzz.Etl/README.md)
* [User Interface -  Developer README](../../EdFi.Buzz.UI/README.md)


## Legal Information

Copyright (c) 2020 Ed-Fi Alliance, LLC and contributors.

Licensed under the [Apache License, Version 2.0](../../LICENSE) (the "License").

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

See [NOTICES](../../NOTICES.md) for additional copyright and license notifications.
