# Ed-Fi Buzz

Project Buzz is a mobile tool that puts roster, contact information, and student
survey results into the hands of teachers, just in time for back-to-school
preparations.  The tool provides an educator with three views into their
student’s data:

1. **Rostering.** This shows teachers all their students along with contact
   information like school email, primary guardian contact information, and
   contact notes, and can be filtered by class or student name.
2. **Student Detail.** This view contains an expanded contact section containing
   siblings and other guardians. The student detail view also shows teachers how
   their students answered each survey.
3. **Survey Results.** This allows teachers to look into a survey and see how
   their students responded. The survey viewer provides a quick summary of the
   results and an easy navigation to the individual student’s responses.

Project Buzz also provides a way for teachers to add notes/feedback on their
students. This functionality provides an important way for teachers to include
commentary and updates in conjunction with the contact information and student
responses they are already working with. The note function can flag outdated
survey information or add additional insight into how to reach the student.

## Developer READMEs

Developer information for each Project Buzz application is outlined in a README within their respective root folders. The READMEs contain instructions for running the applications for debugging, or other tasks.

* [API - Developer README](EdFi.Buzz.Api/README.md)
* [Database -  Developer README](EdFi.Buzz.Database/README.md)
* [ETL -  Developer README](EdFi.Buzz.ETL/README.md)
* [User Interface -  Developer README](EdFi.Buzz.UI.Angular/README.md)

## End-User Installation

Deployment artifacts are created for each application with a build-package PowerShell script in the eng folders (/eng/build-package.ps1). The install scripts can also be employed in continuous deployment scenarios that support PowerShell scripting.

Each archive will contain end-user installation instructions in a install markdown file in the Windows deployment folder (/eng/Windows/install.md). Users can follow these instructions for deployment to their environments.

* [API - Windows Installation](EdFi.Buzz.Api/eng/Windows/install.md)
* [Database - Windows Installation](EdFi.Buzz.Database/eng/Windows/install.md)
* [ETL - Windows Installation](EdFi.Buzz.ETL/eng/Windows/install.md)
* [User Interface - Windows Installation](EdFi.Buzz.UI.Angular/eng/windows/install.md)

## Legal Information

Copyright (c) 2020 Ed-Fi Alliance, LLC and contributors.

Licensed under the [Apache License, Version 2.0](LICENSE) (the "License").

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

See [NOTICES](NOTICES.md) for additional copyright and license notifications.
