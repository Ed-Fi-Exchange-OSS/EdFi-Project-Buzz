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

  [string] $schema = "buzz",
  [string] $uriDiscovery,
  [string] $googleClientID,
  [string] $clientSecret,
  [string] $googleAuthCallback,
  [string] $surveyFilesFolder,
  [int]
  $port = 3000,

  [Parameter(Mandatory = $true)]
  [string] $toolsPath,
  [Parameter(Mandatory = $true)]
  [string] $packagesPath,
  [Parameter(Mandatory = $true)]
  [string] $nginxPort,
  [Parameter(Mandatory = $true)]
  [string] $rootDir = "dist",
  [Parameter(Mandatory = $true)]
  [string] $app = "UI"
)

Import-Module "$PSScriptRoot/Buzz-App-Install.psm1" -Force
Initialize-AppInstaller -toolsPath $toolsPath  -packagesPath $packagesPath

Write-Host "Begin Ed-Fi Buzz $($script:app) installation..." -ForegroundColor Yellow

$envFile = @"
/*
 * SPDX-License-Identifier: Apache-2.0
 * Licensed to the Ed-Fi Alliance under one or more agreements.
 * The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
 * See the LICENSE and NOTICES files in the project root for more information.
 */
NODE_TLS_REJECT_UNAUTHORIZED='1'
BUZZ_API_DB_HOST = '$DbServer'
BUZZ_API_DB_PORT = $DbPort
BUZZ_API_DB_USERNAME ='$DbUserName'
BUZZ_API_DB_PASSWORD = '$DbPassword'
BUZZ_API_DB_DATABASE = '$DbName'
BUZZ_API_DB_SCHEMA = '$schema'
BUZZ_API_HTTP_PORT = $port
BUZZ_WORKER_JOB_NAME = 'buzzSurvey'
BUZZ_WORKER_CLEANUP_JOB_NAME = 'buzzCleanUp'
URI_DISCOVERY=https://accounts.google.com/.well-known/openid-configuration
___URI_DISCOVERY = https://login.microsoftonline.com/common/.well-known/openid-configuration
GOOGLE_DISCOVERY=https://accounts.google.com/.well-known/openid-configuration
GOOGLE_CLIENT_ID=$googleClientID
GOOGLE_SECRET=$clientSecret
GOOGLE_AUTH_CALLBACK=$googleAuthCallback
SURVEY_FILES_FOLDER=$surveyFilesFolder
SURVEY_MAX_FILE_SIZE_BYTES=1mb
SURVEY_PROCESS_INITIAL_STATUS_KEY=1
SURVEY_FILES_RETENTION_DAYS=1

"@

try {

  New-Item -Path $script:InstallPath -ItemType Directory -Force | Out-Null

  $nginxVersion = Get-HelperAppIfNotExists -Url $NginxUrl -targetLocation $script:InstallPath
  Install-NginxFiles -nginxVersion $nginxVersion -webSitePath $script:InstallPath -fileContents $envFile -rootDir $rootDir -nginxPort $nginxPort

  New-DotEnvFile -appPath "$script:InstallPath\$nginxVersion\" -fileContents $envFile

  # NGINX will be mapped to a different port and redirect thru ARR Reverse Proxy in the web.config.
  $winSwVersion = Get-HelperAppIfNotExists -Url $WinSWUrl -targetLocation $script:InstallPath
  Install-NginxService -nginxVersion $nginxVersion -winSwVersion $winSwVersion -webSitePath $script:InstallPath -app $app

  Write-Host "End Ed-Fi Buzz $($script:app) installation." -ForegroundColor Yellow
}
catch {
  Write-Host $_
  Write-Host $_.ScriptStackTrace
  Write-Host "EdFi Buzz api install failed."

}
