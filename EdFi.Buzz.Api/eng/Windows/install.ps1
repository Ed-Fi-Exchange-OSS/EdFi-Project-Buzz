# SPDX-License-Identifier: Apache-2.0
# Licensed to the Ed-Fi Alliance under one or more agreements.
# The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
# See the LICENSE and NOTICES files in the project root for more information.

#Requires -version 5
#Requires -RunAsAdministrator

[CmdletBinding()]
param(
  [string]
  $InstallPath = "c:\Ed-Fi\Buzz\API",

  [string]
  $WinSWUrl = "https://github.com/winsw/winsw/releases/download/v2.9.0/WinSW.NETCore31.zip",

  [string]
  $DbServer = "localhost",

  [int]
  $DbPort = 5432,

  [string]
  $DbUserName = "postgres",

  [string]
  [Parameter(Mandatory=$true)]
  $DbPassword,

  [string]
  $DbName = "Buzz",

  [int]
  $HttpPort = 3000
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

function Install-WebApplication {
  $parameters = @{
    Path = "$PSScriptRoot\..\dist"
    Destination = $InstallPath
    Recurse = $true
    Force = $true
  }
  Copy-Item @parameters

  Push-Location "$InstallPath\dist"
  Write-Host "Executing: npm install --production"
  &npm install --production
  Pop-Location
}

function Install-NodeService {
  param(
    [string]
    $winSwVersion
  )

  $serviceName = "EdFi-Buzz-Api"

  # If service already exists, stop and remove it so that new settings
  # will be applied.
  $exists = Get-Service -name $serviceName -ErrorAction SilentlyContinue

  if ($exists) {
    Stop-Service -name $serviceName
    &sc.exe delete $serviceName
  }

  # Rename WindowsService.exe to BuzzApi.exe
  $winServiceExe = "$InstallPath\$winSwVersion\WindowsService.exe"
  $edFiBuzzApiExe = "$InstallPath\$winSwVersion\EdFiBuzzApi.exe"
  if ((Test-Path -Path "$InstallPath\$winSwVersion\WindowsService.exe")) {
    Move-Item -Path $winServiceExe -Destination $edFiBuzzApiExe
  }

  # Copy the config XML file to install directory
  $xmlFile = "$InstallPath\$winSwVersion\EdFiBuzzApi.xml"
  Copy-Item -Path "$PSScriptRoot\EdFiBuzzApi.xml" -Destination $xmlFile -Force

  # Inject the correct path to nginx.exe into the config XML file
  $content = Get-Content -Path $xmlFile -Encoding UTF8
  $content = $content.Replace("{0}", "$InstallPath")
  $content | Out-File -FilePath $xmlFile -Encoding UTF8 -Force

  # Create and start the service
  &$edFiBuzzApiExe install
  &$edFiBuzzApiExe start
}

function New-DotEnvFile {
  $fileContents = @"
BUZZ_API_DB_HOST = '$DbServer'
BUZZ_API_DB_PORT = $DbPort
BUZZ_API_DB_USERNAME ='$DbUserName'
BUZZ_API_DB_PASSWORD = '$DbPassword'
BUZZ_API_DB_DATABASE = '$DbName'
BUZZ_API_HTTP_PORT = $HttpPort
"@

  $fileContents | Out-File "$InstallPath\dist\.env" -Encoding UTF8 -Force
}

Write-Host "Begin Ed-Fi Buzz API installation..." -ForegroundColor Yellow

New-Item -Path $InstallPath -ItemType Directory -Force | Out-Null

Install-WebApplication
New-DotEnvFile

$winSwVersion = Get-HelperAppIfNotExists -Url $WinSWUrl
Install-NodeService -winSwVersion $winSwVersion

Write-Host "End Ed-Fi Buzz API installation." -ForegroundColor Yellow
