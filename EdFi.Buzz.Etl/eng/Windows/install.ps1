# SPDX-License-Identifier: Apache-2.0
# Licensed to the Ed-Fi Alliance under one or more agreements.
# The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
# See the LICENSE and NOTICES files in the project root for more information.

#requires -version 5
#requires -RunAsAdministrator

[CmdletBinding()]
param(
  [string]
  $InstallPath = "c:\Ed-Fi\Buzz\ETL",

  [string]
  $WinSWUrl = "https://github.com/winsw/winsw/releases/download/v2.9.0/WinSW.NETCore31.zip",

  [string]
  $DbServer = "localhost",

  [int]
  $DbPort = 5432,

  [string]
  $DbUserName = "postgres",

  [string]
  [Parameter(Mandatory = $true)]
  $DbPassword,

  [string]
  $DbName = "edfi_buzz"

)

# TODO: insure this is run as an administrator

# TODO: ensure node.js exists with minimum version

# TODO: refactor to share functions instead of duplicate them
# in various application installer scripts.
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
  $content = $content.Replace("{1}", "$DbUserName")
  $content = $content.Replace("{2}", "$DbPassword")
  $content = $content.Replace("{3}", "$DbServer")
  $content = $content.Replace("{4}", "$DbPort")
  $content = $content.Replace("{5}", "$DbName")
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
BUZZ_ETL_DB_HOST = '$DbServer'
BUZZ_ETL_DB_PORT = $DbPort
BUZZ_ETL_DB_USERNAME ='$DbUserName'
BUZZ_ETL_DB_PASSWORD = '$DbPassword'
BUZZ_ETL_DB_DATABASE = '$DbName'
BUZZ_MAX=20
BUZZ_IDLETIMEOUTMILLIS=5000
BUZZ_CONNECTIONTIMEOUTMILLIS=2000
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
  &npm install --production
  Pop-Location
}

Write-Host "Begin Ed-Fi Buzz ETL installation..." -ForegroundColor Yellow

New-Item -Path $InstallPath -ItemType Directory -Force | Out-Null
$winSwVersion = Get-HelperAppIfNotExists -Url $WinSWUrl
New-DotEnvFile -installPath  $InstallPath
Install-DistFiles -installPath $InstallPath
Install-NodeService -winSwVersion $winSwVersion

Write-Host "End Ed-Fi Buzz ETL installation." -ForegroundColor Yellow
