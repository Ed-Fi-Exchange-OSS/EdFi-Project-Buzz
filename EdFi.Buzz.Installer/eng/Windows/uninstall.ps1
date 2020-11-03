# SPDX-License-Identifier: Apache-2.0
# Licensed to the Ed-Fi Alliance under one or more agreements.
# The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
# See the LICENSE and NOTICES files in the project root for more information.

<#
.SYNOPSIS
This script uninstalls Ed-Fi Buzz apps.

.DESCRIPTION
Requires administrator privileges.

.PARAMETER configPath
Full path to a JSON document containing configuration settings
for Buzz. Defaults to .\configuration.json in the same directory.

.EXAMPLE
.\uninstall.ps1
.EXAMPLE
.\uninstall.ps1 -configPath c:/different/location/for/configuration.json
#>

#Requires -Version 5
#Requires -RunAsAdministrator

param (
    [string] $configPath = "./configuration.json"
)

Import-Module "$PSScriptRoot/configHelper.psm1" -Force
Import-Module "$PSScriptRoot/Application/appuninstalls.psm1" -Force

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
    Uninstall-BuzzApp -app "ETL" -appPath  (Join-Path $installPath "ETL")
    Uninstall-BuzzApp -app "API" -appPath  (Join-Path $installPath "API")
    Uninstall-BuzzApp -app "UI" -appPath  (Join-Path $installPath "UI")
}
catch {
    Write-Error $_
    Write-Error $_.ScriptStackTrace
    throw;
}

exit;
