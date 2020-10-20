# SPDX-License-Identifier: Apache-2.0
# Licensed to the Ed-Fi Alliance under one or more agreements.
# The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
# See the LICENSE and NOTICES files in the project root for more information.

#Requires -version 5
#Requires -RunAsAdministrator

[CmdletBinding()]
param(
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

$distFolder = Resolve-Path "$PSScriptRoot/../dist"
$logFile = ".\edfi-buzz-database.install.log"

if (-not(Test-Path $distFolder)) {
    # Need one more parent directory if running straight from source code
    # instead of from NuGet package.
    $distFolder = "$PSScriptRoot/../../dist"
    if (-not(Test-Path $distFolder)) {
        throw "Cannot find dist directory"
    }
}

function New-DotEnvFile {
    $fileContents = @"
BUZZ_DB_HOST = '$DbServer'
BUZZ_DB_PORT = $DbPort
BUZZ_DB_USERNAME ='$DbUserName'
BUZZ_DB_PASSWORD = '$DbPassword'
BUZZ_DB_DATABASE = '$DbName'
"@

    $fileContents | Out-File "$distFolder/.env" -Encoding UTF8 -Force
}

function Install-Migrations {
    $exitcode = 0
    try {
        Push-Location -Path $distFolder
        Write-Host "Executing: npm run migrate $DbName --config ./migrate-database.json" -ForegroundColor Magenta
        &npm run migrate "$DbName" --config ./migrate-database.json | Out-File -FilePath $logFile -Append
        Write-Host "Database was migrated to the latest" -ForegroundColor Magenta
        exit $exitcode
    }
    catch {
        $ErrorActionPreference = "Continue"
        Write-Host "Database was not migrated"
        Write-Host $_.ScriptStackTrace
        throw $_
    }
    finally {
        Pop-Location
    }
}

function Install-Database {
    $ErrorActionPreference = "Continue"

    $output = ""

    try {
        Push-Location -Path $distFolder
        Write-Host "Executing: npm install --production" -ForegroundColor Magenta
        &npm install --production --silent

        Write-Host "Executing: npm run init-db $DbName --config ./create-database.json" -ForegroundColor Magenta
        &npm run init-db "$DbName" --config ./create-database.json | Out-File -FilePath $logFile -Append
    }
    catch {
        Write-Host "Database creation process threw an exception, but will still run migrations..."
        Write-Host $_.ScriptStackTrace
        Write-Host "Continuing on..."
    }
    finally {
        Pop-Location
        Exit 0
    }
}

try {
    Write-Host "Begin EdFi Buzz database installation..." -ForegroundColor Yellow

    New-DotEnvFile
    Install-Database
    Install-Migrations

    Write-Host "End EdFi Buzz Database installation." -ForegroundColor Yellow
    Exit 0
}
catch {
    Write-Host "EdFi Buzz database install failed."
    exit $LASTEXITCODE
}
