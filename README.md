# Fix-It-Friday

_Project overview will go here..._

## Installation

_Brief notes..._

* To host in IIS, must install the [.NET Core 3.1 Hosting Bundle](https://dotnet.microsoft.com/download/dotnet-core/3.1).
* The `EdFi.FixItFriday.Installer` package contains a PowerShell script for
  automating deployment of all components of the solution. It will be bundled
  into a NuGet package and pushed to MyGet for distribution. It can be executed
  manually: first run the build script to prepare the local directory, even if
  you don't care about the NuGet package output. Then import the local module
  and run `get-help` on the available public functions to learn how to use them:
  `Install-FixItFriday` and `Uninstall-FixItFriday`.

  ```powershell
  PS > cd EdFi.FixItFriday.Installer
  PS > .\build-package.ps1 -version 1.0.0 -BuildCounter 6
  PS > import-module .\Install-FixItFriday.psm1
  PS > get-help Install-FixItFriday
  PS > get-help Uninstall-FixItFriday
  ```

  (at this time only supports API installation)

## Legal Information

Copyright (c) 2020 Ed-Fi Alliance, LLC and contributors.

Licensed under the [Apache License, Version 2.0](LICENSE) (the "License").

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

See [NOTICES](NOTICES.md) for additional copyright and license notifications.