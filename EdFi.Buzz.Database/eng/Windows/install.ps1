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

Import-Module "$PSScriptRoot/Buzz-App-Install.psm1" -Force
Initialize-AppInstaller -toolsPath $toolsPath  -packagesPath $packagesPath

$distFolder = Resolve-Path "$PSScriptRoot/../dist"
$logFile = ".\edfi-buzz-database.install.log"
$npm = "C:\Program Files\nodejs\npm.cmd"

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
    try {
        Push-Location -Path $distFolder
        Write-Host "Executing: npm run migrate $DbName --config ./migrate-database.json" -ForegroundColor Magenta
        & $npm run migrate --silent "$DbName" --config ./migrate-database.json | Out-File -FilePath $logFile -Append
        Write-Host "Database was migrated to the latest" -ForegroundColor Magenta
    }
    catch {
        Write-Host "Database was not migrated"
        throw $_
    }
    finally {
        Pop-Location
    }
}

function Install-Database {
    $output = ""

    try {
        Push-Location -Path $distFolder
        $ErrorActionPreference = "Continue"
        Write-Host "Executing: npm install --production" -ForegroundColor Magenta
        $output = & $npm install --production --silent 2>&1

        Write-Host "Executing: npm run init-db $DbName --config ./create-database.json" -ForegroundColor Magenta
        $output = & $npm run init-db "$DbName" --config ./create-database.json 2>&1
        $ErrorActionPreference = "Stop"
    }
    catch {
        Write-Host $_
        Write-Host "Continuing on..."
    }
    finally {
        Pop-Location
    }
}

try {
    Write-Host "Begin EdFi Buzz database installation..." -ForegroundColor Yellow
	New-DotEnvFile
    Install-Database
    Install-Migrations
    Write-Host "End EdFi Buzz Database installation." -ForegroundColor Yellow
}
catch {
    Write-Host $_
    Write-Host $_.ScriptStackTrace
    Write-Host "EdFi Buzz database install failed."
}
