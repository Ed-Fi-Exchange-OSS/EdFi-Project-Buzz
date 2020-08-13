# SPDX-License-Identifier: Apache-2.0
# Licensed to the Ed-Fi Alliance under one or more agreements.
# The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
# See the LICENSE and NOTICES files in the project root for more information.

#requires -version 5

[CmdletBinding()]
param(
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
  $DbName = "edfi_buzz"
)
$InstallPath = "$PSScriptRoot/../dist"
if (-not(Test-Path $InstallPath)) {
    # Need one more parent directory if running straight from source code
    # instead of from NuGet package.
    $InstallPath = "$PSScriptRoot/../../dist"
    if (-not(Test-Path $InstallPath)) {
        throw "Cannot find dist directory"
    }
}

function New-DotEnvFile {
  $fileContents = @"
BUZZ_DB_HOST = '$DbServer'
BUZZ_DB_PORT = $DbPort
BUZZ_DB_USERNAME ='$DbUserName'
BUZZ_DB_PASSWORD = '$DbPassword'
"@

  $fileContents | Out-File "$InstallPath/.env" -Encoding UTF8 -Force
}

function Add-Database-DotEnvFile {
    $fileContents = @"
BUZZ_DB_HOST = '$DbServer'
BUZZ_DB_PORT = $DbPort
BUZZ_DB_USERNAME ='$DbUserName'
BUZZ_DB_PASSWORD = '$DbPassword'
BUZZ_DB_DATABASE = '$DbName'
"@

    $fileContents | Out-File "$InstallPath/.env" -Encoding UTF8 -Force
  }

function Install-Migrations{
    Add-Database-DotEnvFile
    Write-Host "Executing: npm run migrate" -ForegroundColor Magenta
    &npm run migrate
}

function Install-Database {
    Push-Location -Path $InstallPath
    Write-Host "Executing: npm install --production" -ForegroundColor Magenta
    &npm install --production

    Write-Host "Executing: npm run init-db" -ForegroundColor Magenta
    $output = &npm run init-db $DbName 2>&1

    if ($LASTEXITCODE -ne 0)
    {
        $err = $output.Where{$PSItem -match 'already exists'}
        if($err.Length -gt 0){
            Install-Migrations
        }
        else{
            Write-Host "Error: Unable to connect to the database '$($DbName)'." -ForegroundColor Red
        }
    }
    else{
        Install-Migrations
    }
    Pop-Location
}

Write-Host "Begin EdFi Buzz database installation..." -ForegroundColor Yellow

New-Item -Path $InstallPath -ItemType Directory -Force | Out-Null

New-DotEnvFile
Install-Database

Write-Host "End EdFi Buzz API installation." -ForegroundColor Yellow
