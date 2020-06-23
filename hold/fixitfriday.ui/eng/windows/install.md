# Windows Installation Instructions

## Overview

The primary deployment model for Ed-Fi Fix-it-Friday will be through Docker
containers. This script provides a simple method for quickly standing up the UI
application directly in Windows as a service. It uses
[NGiNX](https://www.nginx.org/) as the web server for static content, and
[WinSW](https://github.com/winsw/winsw) as a wrapper around NGiNX for startup as
a Windows Service.

Please note that NGiNX on Windows is still considered a beta product that might
not be appropriate for production deployments. If anyone wishes to run a
production installation directly in Windows, then it is recommended to configure
the `build` directory in IIS or another production-ready web server.

The installation files can be installed with `nuget.exe` or by downloading the
current release from the [Ed-Fi MyGet
feed](https://www.myget.org/feed/ed-fi/package/nuget/fixitfriday.ui). If
downloading, change the file name extension from `.nupkg` to `.zip` and unzip
the folder. When installing with `nuget.exe` at the command line, the files are
unzipped automatically.

The installation hosts the application on port 8123 by default. You can
open the nginx.conf file to change the port number.

Once installed, open http://localhost:8123 in your favorite browser.

## Install

Open PowerShell, change to this `windows` working directory, and run
`install.ps1`. By default it will install the application into
c:\Ed-Fi\Fix-it-Friday\UI. The newly-created Windows service will start
automatically.

```powershell
cd c:\temp\download-directory

# `-prerelease` argument is optional for downloading the latest preview.
nuget.exe install fixitfriday.ui -prerelease -source https://www.myget.org/F/ed-fi/api/v2

cd fixitfriday.ui*\windows

# Example: install with all defaults
.\install.ps1

# Example: install with override of all options
$parameters = @{
  InstallPath = "d:\fixit\user-interface"
  NginxUrl = "http://nginx.org/download/nginx-1.18.0.zip"
  WinSWUrl = "https://github.com/winsw/winsw/releases/download/v2.8.0/WinSW.NETCore31.zip"
}
.\install.ps1 @parameters
```

## Uninstall

Open PowerShell, change to the installation directory, and then
`WinSW.NETCore31`. Run the executable with argument `stop` and then run again
with argument `uninstall`.

```powershell
cd C:\Ed-Fi\Fix-it-Friday\UI\WinSW.NETCore31
&.\FixItFridayUi.exe stop
&.\FixItFridayUi.exe uninstall
```
