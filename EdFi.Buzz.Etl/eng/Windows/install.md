# Windows Installation Instructions for the Buzz API

## Overview

This script provides a simple method for quickly standing up the Survey ETL
application directly in Windows as a service. It uses
[WinSW](https://github.com/winsw/winsw) as a wrapper around the [graphile-worker](https://github.com/graphile/worker) for startup as
a Windows Service.

The installation files can be installed with `nuget.exe` or by downloading the
current release from the [Ed-Fi MyGet
feed](https://www.myget.org/feed/ed-fi/package/nuget/edfi.buzz.etl). If
downloading, change the file name extension from `.nupkg` to `.zip` and unzip
the folder. When installing with `nuget.exe` at the command line, the files are
unzipped automatically.

## Install

Open PowerShell, change to this `windows` working directory, and run
`install.ps1`. By default it will install the application into
c:\Ed-Fi\Buzz\ETL. The newly-created Windows service will start
automatically.

```powershell
cd c:\temp\download-directory

# `-prerelease` argument is optional for downloading the latest preview.
nuget.exe install buzz.etl -prerelease -source https://www.myget.org/F/ed-fi/api/v2

cd edfi.buzz.etl\windows

# Example: install with all defaults
.\install.ps1

# Example: install with override of all options
$parameters = @{
  InstallPath = "d:\edfibuzz\etl"
  WinSWUrl = "https://github.com/winsw/winsw/releases/download/v2.8.0/WinSW.NETCore31.zip"
}
.\install.ps1 @parameters
```

## Uninstall

Open PowerShell, change to the installation directory, and then
`WinSW.NETCore31`. Run the executable with argument `stop` and then run again
with argument `uninstall`.

```powershell
cd C:\Ed-Fi\Buzz\ETL\WinSW.NETCore31
&.\EdFiBuzzEtl.exe stop
&.\EdFiBuzzEtl.exe uninstall
```
