# SPDX-License-Identifier: Apache-2.0
# Licensed to the Ed-Fi Alliance under one or more agreements.
# The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
# See the LICENSE and NOTICES files in the project root for more information.

#Requires -version 5
#Requires -RunAsAdministrator

[CmdletBinding()]
param(
  [string]
  $InstallPath = "C:\Ed-Fi\Buzz\API",

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
  [Parameter(Mandatory = $true)]
  $DbPassword,

  [string]
  $DbName = "Buzz",

  [string] $uriDiscovery,
  [string] $googleClientID,
  [string] $clientSecret,
  [string] $googleAuthCallback,
  [string] $idProvider,
  [string] $surveyFilesFolder,
  [int]
  $port = 3000,

  [Parameter(Mandatory = $true)]
  [string] $toolsPath,
  [Parameter(Mandatory = $true)]
  [string] $packagesPath,
  [Parameter(Mandatory = $true)]
  [string] $rootDir = "dist",
  [Parameter(Mandatory = $true)]
  [string] $app = "API",
  [Parameter(Mandatory = $true)]
  [string]
  $SqlServerHost = "127.0.0.1",

  [bool]
  $KeepSurveysSynch = $false,

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
  $internalRoute,

  [Parameter(Mandatory = $true)]
  [string]
  $externalRoute
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

  if (-not (Test-Path -Path "$script:installPath\$version")) {
    $outFile = ".\$version.zip"
    Invoke-WebRequest -Uri $Url -OutFile $outFile

    Expand-Archive -Path $outFile

    if ((Test-Path -Path "$version\$version")) {
      Move-Item -Path "$version\$version" -Destination $script:installPath
      Remove-Item -Path $version
    }
    else {
      Move-Item -Path "$version" -Destination $script:installPath
    }
  }

  return $version
}

function Install-WebApplication {
  $parameters = @{
    Path = "$PSScriptRoot\..\dist"
    Destination = "$script:installPath\dist"
    Recurse = $true
    Force = $true
  }
  Copy-Item @parameters

  Push-Location "$script:installPath\dist"
  Write-Host "Executing: npm install --production"
  &npm install --production --silent
  Pop-Location
}

function New-DotEnvFile {
  $envFile = ""

  if ("google" -eq $idProvider) {
    $envFile = @"
NODE_TLS_REJECT_UNAUTHORIZED=1
BUZZ_API_DB_HOST=$DbServer
BUZZ_API_DB_PORT=$DbPort
BUZZ_API_DB_USERNAME=$DbUserName
BUZZ_API_DB_PASSWORD=$DbPassword
BUZZ_API_DB_DATABASE=$DbName
BUZZ_API_HTTP_PORT=$port
BUZZ_WORKER_JOB_NAME=buzzSurvey
BUZZ_WORKER_CLEANUP_JOB_NAME=buzzCleanUp
ODS_DBNAME=$SqlServerDbName
ODS_SERVER=$SqlServerHost
ODS_USER=$SqlServerUserName
ODS_PASSWORD=$SqlServerPassword
ODS_PORT=$SqlServerPort
ODS_TRUSTSERVERCERTIFICATE=false
ODS_ENABLEARITHABORT=true
ODS_ENCRYPT=false
URI_DISCOVERY=https://accounts.google.com/.well-known/openid-configuration
GOOGLE_DISCOVERY=https://accounts.google.com/.well-known/openid-configuration
GOOGLE_CLIENT_ID=$googleClientID
GOOGLE_SECRET=$clientSecret
GOOGLE_AUTH_CALLBACK=$googleAuthCallback
SURVEY_FILES_FOLDER=$surveyFilesFolder
SURVEY_MAX_FILE_SIZE_BYTES=1mb
SURVEY_PROCESS_INITIAL_STATUS_KEY=1
SURVEY_FILES_RETENTION_DAYS=1
KEEP_SURVEY_SYNCH=$KeepSurveysSynch
"@
  }
  else {
    $envFile = @"
NODE_TLS_REJECT_UNAUTHORIZED=1
BUZZ_API_DB_HOST=$DbServer
BUZZ_API_DB_PORT=$DbPort
BUZZ_API_DB_USERNAME=$DbUserName
BUZZ_API_DB_PASSWORD=$DbPassword
BUZZ_API_DB_DATABASE=$DbName
BUZZ_API_HTTP_PORT=$port
BUZZ_WORKER_JOB_NAME=buzzSurvey
BUZZ_WORKER_CLEANUP_JOB_NAME=buzzCleanUp
ODS_DBNAME=$SqlServerDbName
ODS_SERVER=$SqlServerHost
ODS_USER=$SqlServerUserName
ODS_PASSWORD=$SqlServerPassword
ODS_PORT=$SqlServerPort
ODS_TRUSTSERVERCERTIFICATE=false
ODS_ENABLEARITHABORT=true
ODS_ENCRYPT=false
URI_DISCOVERY=https://login.microsoftonline.com/common/.well-known/openid-configuration
GOOGLE_DISCOVERY=
GOOGLE_CLIENT_ID=
GOOGLE_SECRET=
GOOGLE_AUTH_CALLBACK=
SURVEY_FILES_FOLDER=$surveyFilesFolder
SURVEY_MAX_FILE_SIZE_BYTES=1mb
SURVEY_PROCESS_INITIAL_STATUS_KEY=1
SURVEY_FILES_RETENTION_DAYS=1
KEEP_SURVEY_SYNCH=$KeepSurveysSynch

"@
  }
  $envFile | Out-File "$script:installPath\dist\.env" -Encoding UTF8 -Force
}

try {
  Write-Host "Begin Ed-Fi Buzz API installation..." -ForegroundColor Yellow

  New-Item -Path $script:installPath -ItemType Directory -Force | Out-Null

  Install-WebApplication
  New-DotEnvFile

  # update the web.config with URL rewritten paths
  $apiRedirectDir = "$script:installPath/../API-Redirect"
  Write-Host "Create re-write rules in $apiRedirect\web.config"
  $replacements = @{
    "%INTERNAL_ROUTE%"=$script:internalRoute
    "%EXTERNAL_ROUTE%"=$script:externalRoute
  }
  # Move the web.config
  New-Item -Path $apiRedirectDir -ItemType Directory -ErrorAction SilentlyContinue
  Move-Item -Path "$PSScriptRoot\web.config" -Destination $apiRedirectDir -Force -ErrorAction SilentlyContinue
  Update-File -appPath "$apiRedirectDir\web.config" -replacements $replacements

  $winSwVersion = Get-HelperAppIfNotExists -Url $WinSWUrl
  Install-NodeService -winSwVersion $winSwVersion -InstallPath $script:installPath -app $app

  Write-Host "End Ed-Fi Buzz API installation." -ForegroundColor Yellow

}
catch {
  Write-Host $_
  Write-Host $_.ScriptStackTrace
  Write-Host "EdFi Buzz api install failed."

}
