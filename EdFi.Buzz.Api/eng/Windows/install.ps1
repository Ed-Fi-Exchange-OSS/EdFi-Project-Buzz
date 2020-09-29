# SPDX-License-Identifier: Apache-2.0
# Licensed to the Ed-Fi Alliance under one or more agreements.
# The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
# See the LICENSE and NOTICES files in the project root for more information.

#Requires -version 5
#Requires -RunAsAdministrator

[CmdletBinding()]
param(
  [string]
  $InstallPath = "C:\inetpub\Ed-Fi\Buzz\API",

  [string]
  $NginxUrl = "http://nginx.org/download/nginx-1.19.0.zip",

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


function Install-NginxFiles{
  param(
    [string]
    $nginxVersion
  )

  # Copy the dist directory into the NGiNX folder
  $parameters = @{
    Path = "$PSScriptRoot\..\dist"
    Destination = "$InstallPath\$nginxVersion\dist"
    Recurse = $true
    Force = $true
  }
  Copy-Item @parameters

  # Overwrite the NGiNX conf file with our conf file
  $paramaters = @{
    Path = "$PSScriptRoot\..\nginx.conf"
    Destination = "$InstallPath\$nginxVersion\conf\nginx.conf"
    Force = $true
  }
  Copy-Item @paramaters
}

function Install-NginxService {
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

  param(
    [string]
    $installPath
  )

  New-Item -Path "$installPath/.env" -ItemType File -Force | Out-Null

  $fileContents = @"
BUZZ_API_DB_HOST = '$DbServer'
BUZZ_API_DB_PORT = $DbPort
BUZZ_API_DB_USERNAME ='$DbUserName'
BUZZ_API_DB_PASSWORD = '$DbPassword'
BUZZ_API_DB_DATABASE = '$DbName'
BUZZ_API_HTTP_PORT = $HttpPort
"@

  $fileContents | Out-File "$InstallPath\.env" -Encoding UTF8 -Force
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
}

Write-Host "Begin Ed-Fi Buzz API installation..." -ForegroundColor Yellow

New-Item -Path $InstallPath -ItemType Directory -Force | Out-Null

Install-DistFiles -installPath $InstallPath
New-DotEnvFile -installPath  "$InstallPath/dist"

$nginxVersion = Get-HelperAppIfNotExists -Url $NginxUrl
Install-NginxFiles -nginxVersion $nginxVersion

$winSwVersion = Get-HelperAppIfNotExists -Url $WinSWUrl
Install-NginxService -winSwVersion $winSwVersion

Write-Host "End Ed-Fi Buzz API installation." -ForegroundColor Yellow
