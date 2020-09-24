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

#Requires -Version 5
#Requires -RunAsAdministrator

param (
    [string] $configPath = "./configuration.json"
)


Import-Module "$PSScriptRoot/Database/Configuration.psm1" -Force
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

$packagesPath = "C:\temp\packages"
$toolsPath = "C:\temp\tools"

if (-not $(Test-Path $packagesPath)) {
    mkdir $packagesPath | Out-Null
}

if (-not $(Test-Path $toolsPath)) {
    mkdir $toolsPath | Out-Null
}

function TestCommand ($path) {
    return $(Get-Command $path -ErrorAction SilentlyContinue )
}

$nuget = "nuget.exe"
if (-not $(TestCommand $nuget)) {
    $nuget = "$toolsPath/nuget.exe"

    if (-not $(TestCommand $nuget)) {
        $sourceNugetExe = "https://dist.nuget.org/win-x86-commandline/latest/nuget.exe"

        Write-Host "Downloading nuget.exe official distribution"
        Invoke-WebRequest $sourceNugetExe -OutFile $nuget
    }
}

try {
    # Test for IIS and any Windows Features we will need TODO WHAT DO WE NEED
    Initialize-Installer -toolsPath $toolsPath -configuration $script:conf  -bypassCheck $true

    Install-DatabaseApp -configuration $script:conf -nuget $nuget -packagesPath $script:packagesPath
    Install-ApiApp -configuration $script:conf -nuget $nuget -packagesPath $script:packagesPath
    Install-EtlApp -configuration $script:conf -nuget $nuget -packagesPath $script:packagesPath
    Install-UiApp -configuration $script:conf -nuget $nuget -packagesPath $script:packagesPath
}
catch {
    Write-Error $PSItem.Exception.Message
    Write-Error $PSItem.Exception.StackTrace
    throw;
}

# TODO Verify all services are running

exit;
