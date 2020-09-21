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
for Buzz. Defaults to .\configuration in the same directory.

.EXAMPLE
.\install.ps1
.EXAMPLE
.\install.ps1 -configPath ./configuration
#>

#Requires -Version 5
#Requires -RunAsAdministrator

param (
    [string] $configPath = "$PSScriptRoot/configuration.json"
)

$currDir = $PSScriptRoot

Import-Module "$PSScriptRoot/Database/Configuration.psm1" -Force
Import-Module "$PSScriptRoot/configHelper.psm1" -Force
Import-Module "$PSScriptRoot/init.psm1" -Force
Import-Module "$PSScriptRoot/Application/appinstalls.psm1" -Force

$installPath = "C:/Ed-Fi/Buzz"
$packagesPath = Join-Path $installPath "packages"
$toolsPath = Join-Path $installPath "tools"

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

# Test for IIS and any Windows Features we will need TODO WHAT DO WE NEED
Initialize-Installer -toolsPath $toolsPath -bypassCheck $true

# Confirm required parameters to install
# Repo location should be configuration with overrides
# Each NuGet should be retrieveable using NuGet.executable
$conf = Format-BuzzConfigurationFileToHashTable $configPath

$artifactRepo = $conf.artifactRepo

# Test the connection strings for SQL Server
$sqlServer = @{
    Engine = "SqlServer"
    Server = $conf.sqlServerDatabase.host
    Port = $conf.sqlServerDatabase.port
    UseIntegratedSecurity = $false # TODO SUPPORT INTEGRATED SECURITY IN ETL
    Username = $conf.sqlServerDatabase.username
    Password = $conf.sqlServerDatabase.password
    DatabaseName = $conf.sqlServerDatabase.database
}
Assert-DatabaseConnectionInfo $sqlServer -RequireDatabaseName

# Test the connection strings for PostgreSQL
$postgres = @{
    Engine = "PostgreSQL"
    Server = $conf.postgresDatabase.host
    Port = $conf.postgresDatabase.port
    UseIntegratedSecurity = $false
    Username = $conf.postgresDatabase.username
    Password = $conf.postgresDatabase.password
    DatabaseName = $conf.postgresDatabase.database
}

Assert-DatabaseConnectionInfo $postgres -RequireDatabaseName

# Install Buzz Database - downloads and executes the database install script
Install-AssetFromNuget -nuget $script:nuget -app "Database" -packageName "edfi.buzz.database" -version $script:conf.database.version -source $script:conf.artifactRepo -packagesPath $script:packagesPath -conf $script:conf

# # Install API - downloads the parameterized version (latest as default) and executes the API install script
# Install-AssetFromNuget -nuget $script:nuget -app "API" -packageName "edfi.buzz.api" -version $script:conf.api.version -source $script:conf.artifactRepo -packagesPath $script:packagesPath -conf $script:conf

# # Install ETL - downloads the parameterized version (latest as default) and executes the ETL install script
# Install-AssetFromNuget -nuget $script:nuget -app "Etl" -packageName "edfi.buzz.etl" -version $script:conf.etl.version -source $script:conf.artifactRepo -packagesPath $script:packagesPath -conf $script:conf

# # Install UI - downloads the parameterized version (latest as default) and executes the UI install script
# Install-AssetFromNuget -nuget $script:nuget -app "UI" -packageName "edfi.buzz.ui" -version $script:conf.ui.version -source $script:conf.artifactRepo -packagesPath $script:packagesPath -conf $script:conf

# TODO Verify all services are running

exit $LASTEXITCODE;
