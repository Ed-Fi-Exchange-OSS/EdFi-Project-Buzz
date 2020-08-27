Ed-Fi Buzz UI
============

These scripts were made possible thanks to the Ed-Fi Alliance and the Michael and Susan Dell Foundation.

UI - User Interface based on Angular 8
------------

Description
------------
This is the Angular Version of the user interface.

Prerequisites
------------
We recommend that the following prerequisites are installed on the machine that you are going to run the scripts on.

1. Node Js LTS version https://nodejs.org/en/
2. Angular CLI https://cli.angular.io/

That is it =)


Setup Instructions for Development
------------

1. Download the repository
2. Open a PowerShell window and Navigate to the UI folder C:\projects\Ed-Fi-Buzz\UI\
3. Open PowerShell as an "Administrator" and run yarn install
4. Duplicate the [environment.example.json](src/assets/environment.example.json) file, and rename the copy to environment.json, then replace its contents with the correct values for your environment. Either set GOOGLE_CLIENT_ID, to use a google accound, or ADFS_CLIENT_ID and ADFS_TENANT_ID for use ADFS
5. In the same Powershell window type "yarn start"
6. Open a browser (Chrome) and navigate to http://localhost:4200/


```PowerShell
C:\temp\ed-fi\> .\BinaryInstall.ps1
```

## Development server

Run `yarn start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `yarn build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Legal Information

Copyright (c) 2020 Ed-Fi Alliance, LLC and contributors.

Licensed under the [Apache License, Version 2.0](LICENSE) (the "License").

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

See [NOTICES](NOTICES.md) for additional copyright and license notifications.
