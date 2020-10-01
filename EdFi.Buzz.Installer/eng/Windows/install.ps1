# SPDX-License-Identifier: Apache-2.0
# Licensed to the Ed-Fi Alliance under one or more agreements.
# The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
# See the LICENSE and NOTICES files in the project root for more information.

<#
.SYNOPSIS
This script downloads all the assets needed for the Ed-Fi Buzz.
Artifacts are placed in the dist/ directory at the root of this project
.DESCRIPTION
Validates existence of NuGet Package Provider, Node JS, IIS, SQL Server and Postgres.
Retrieves the latest release of several Ed-Fi Buzz NuGet packages.
Downloads prequisites from the web.
The ETL requires a default, local instance of SQL Server, and the
user executing the script must have sufficient permissions. Any existing Buzz
databases on the build server should be backed-up and removed before running
this build script. Requires administrator privileges.

.PARAMETER configPath
Full path to a JSON document containing configuration settings
for Buzz. Defaults to .\configuration.json in the same directory.

.EXAMPLE
.\install.ps1
.EXAMPLE
.\install.ps1 -configPath c:/different/location/for/configuration.json
#>

# WebAdministration will not load on PS Core
#Requires -Version 5 -PSEdition Desktop
#Requires -RunAsAdministrator

param (
    [string] $configPath = "./configuration.json"
)

Import-Module "$PSScriptRoot/configHelper.psm1" -Force
Import-Module "$PSScriptRoot/init.psm1" -Force
Import-Module "$PSScriptRoot/Application/appinstalls.psm1" -Force

# Confirm required parameters to install
# Repo location should be configuration with overrides
# Each NuGet should be retrieveable using NuGet.executable
$conf = Format-BuzzConfigurationFileToHashTable $configPath

if (-not $conf.anyApplicationsToInstall) {
    Write-Host "You have not chosen any Buzz applications to install." -ForegroundColor Red
    exit -1;
}

$installPath = $conf.installPath
$artifactRepo = $conf.artifactRepo

$packagesPath = $conf.packagesPath
$toolsPath = $conf.toolsPath

try {
    Initialize-Installer -toolsPath $toolsPath  -packagesPath $packagesPath

    $params = @{
        "configuration" = $script:conf;
        "packagesPath" = $script:packagesPath;
        "toolsPath" = $script:toolsPath;
    }

    Install-DatabaseApp @params
    Install-ApiApp @params
    Install-EtlApp @params
    Install-UiApp @params

    Check-BuzzServices $script:conf
}
catch {
    Write-Error $PSItem.Exception.Message
    Write-Error $PSItem.Exception.StackTrace
    exit -1;
}

exit;
