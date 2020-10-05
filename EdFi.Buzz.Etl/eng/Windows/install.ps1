# SPDX-License-Identifier: Apache-2.0
# Licensed to the Ed-Fi Alliance under one or more agreements.
# The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
# See the LICENSE and NOTICES files in the project root for more information.

#Requires -version 5
#Requires -RunAsAdministrator

[CmdletBinding()]
param(
  [Parameter(Mandatory = $true)]
  [string]
  $InstallPath = "c:\Ed-Fi\Buzz\ETL",

  [string]
  $WinSWUrl = "https://github.com/winsw/winsw/releases/download/v2.9.0/WinSW.NETCore31.zip",

  [Parameter(Mandatory = $true)]
  [string]
  $SqlServerHost = "127.0.0.1",

  [Parameter(Mandatory = $true)]
  [int]
  $SqlServerPort = 5432,

  [Parameter(Mandatory = $true)]
  [string]
  $SqlServerUserName = "postgres",

  [Parameter(Mandatory = $true)]
  [string]
  $SqlServerPassword,

  [Parameter(Mandatory = $true)]
  [string]
  $SqlServerDbName = "edfi_buzz",

  [Parameter(Mandatory = $true)]
  [string]
  $PostgresHost = "127.0.0.1",

  [Parameter(Mandatory = $true)]
  [int]
  $PostgresPort = 5432,

  [Parameter(Mandatory = $true)]
  [string]
  $PostgresUserName = "postgres",

  [Parameter(Mandatory = $true)]
  [string]
  $PostgresPassword,

  [Parameter(Mandatory = $true)]
  [string]
  $PostgresDbName = "edfi_buzz"
)

function Get-FileNameWithoutExtensionFromUrl {
  param(
    [string]
    $Url
  )

  if (($Url -match "([a-zA-Z0-9\.\-]+)\.zip")) {
    return $Matches[1];
  }

  throw "Unable to parse file name from $Url"
}

function Get-HelperAppIfNotExists {
  param(
    [string]
    $Url
  )
  $version = Get-FileNameWithoutExtensionFromUrl -Url $Url

  if (-not (Test-Path -Path "$InstallPath\$version")) {
    $outFile = ".\$version.zip"
    Invoke-WebRequest -Uri $Url -OutFile $outFile

    Expand-Archive -Path $outFile

    if ((Test-Path -Path "$version\$version")) {
      Move-Item -Path "$version\$version" -Destination $InstallPath
      Remove-Item -Path $version
    }
    else {
      Move-Item -Path "$version" -Destination $InstallPath
    }
  }

  return $version
}

function Install-NodeService {
  param(
    [string]
    $winSwVersion
  )

  $serviceName = "EdFi-Buzz-Etl"

  # If service already exists, stop and remove it so that new settings
  # will be applied.
  $exists = Get-Service -name $serviceName -ErrorAction SilentlyContinue

  if ($exists) {
    Stop-Service -name $serviceName
    &sc.exe delete $serviceName
  }

  # Rename WindowsService.exe to BuzzEtl.exe
  $winServiceExe = "$InstallPath\$winSwVersion\WindowsService.exe"
  $edFiBuzzEtlExe = "$InstallPath\$winSwVersion\EdFiBuzzEtl.exe"
  if ((Test-Path -Path "$InstallPath\$winSwVersion\WindowsService.exe")) {
    Move-Item -Path $winServiceExe -Destination $edFiBuzzEtlExe
  }

  # Copy the config XML file to install directory
  $xmlFile = "$InstallPath\$winSwVersion\EdFiBuzzEtl.xml"
  Copy-Item -Path "$PSScriptRoot\EdFiBuzzEtl.xml" -Destination $xmlFile -Force

  # Inject the correct path to nginx.exe into the config XML file
  $content = Get-Content -Path $xmlFile -Encoding UTF8
  $content = $content.Replace("{0}", "$InstallPath")
  $content = $content.Replace("{1}", "$PostgresUserName")
  $content = $content.Replace("{2}", "$PostgresPassword")
  $content = $content.Replace("{3}", "$PostgresHost")
  $content = $content.Replace("{4}", "$PostgresPort")
  $content = $content.Replace("{5}", "$PostgresDbName")
  $content = $content.Replace("{6}", "$InstallPath/dist")
  $content | Out-File -FilePath $xmlFile -Encoding UTF8 -Force

  # Create and start the service
  &$edFiBuzzEtlExe install
  &$edFiBuzzEtlExe start
}

function New-DotEnvFile {
  param(
    [string]
    $installPath
  )

  New-Item -Path "$installPath/.env" -ItemType File -Force | Out-Null

  $fileContents = @"
  BUZZ_SQLSOURCE=amt
  BUZZ_DBSERVER=$PostgresHost
  BUZZ_PORT=$PostgresPort
  BUZZ_USER=$PostgresUserName
  BUZZ_PASSWORD=$PostgresPassword
  BUZZ_DBNAME=$PostgresDbName
  BUZZ_MAX=20
  BUZZ_IDLETIMEOUTMILLIS=5000
  BUZZ_CONNECTIONTIMEOUTMILLIS=2000
  ODS_DBNAME=$SqlServerDbName
  ODS_SERVER=$SqlServerHost
  ODS_USER=$SqlServerUserName
  ODS_PASSWORD=$SqlServerPassword
  ODS_PORT=$SqlServerPort
  ODS_TRUSTSERVERCERTIFICATE=false
  ODS_ENABLEARITHABORT=true
  ODS_ENCRYPT=false
"@
  $fileContents | Out-File "$installPath/.env" -Encoding UTF8 -Force
}

function Install-DistFiles {
  param(
    [string]
    $installPath
  )

  # Copy the dist directory into the NGiNX folder
  $parameters = @{
    Path        = "$PSScriptRoot/../dist"
    Destination = "$installPath"
    Recurse     = $true
    Force       = $true
  }
  Copy-Item @parameters

  Push-Location "$installPath/dist"
  Write-Host "Executing: npm install --production"
  &npm install --production --silent
  Pop-Location
}

Write-Host "Begin Ed-Fi Buzz ETL installation..." -ForegroundColor Yellow

New-Item -Path $InstallPath -ItemType Directory -Force | Out-Null
$winSwVersion = Get-HelperAppIfNotExists -Url $WinSWUrl
Install-DistFiles -installPath $InstallPath
New-DotEnvFile -installPath  "$InstallPath/dist"
Install-NodeService -winSwVersion $winSwVersion

Write-Host "End Ed-Fi Buzz ETL installation." -ForegroundColor Yellow
