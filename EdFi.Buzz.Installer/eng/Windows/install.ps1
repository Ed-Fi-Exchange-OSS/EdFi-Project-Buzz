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
    [string] $configPath = "$PSScriptRoot\configuration.json"
)

Import-Module "$PSScriptRoot\Database\Configuration.psm1" -Force
Import-Module "$PSScriptRoot\configHelper.psm1" -Force
Import-Module "$PSScriptRoot\init.psm1" -Force

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
    UseIntegratedSecurity = $false # TODO SUPPORT INTEGRATED SECURITY IN ETL
    Username = $conf.postgresDatabase.username
    Password = $conf.postgresDatabase.password
    DatabaseName = $conf.postgresDatabase.database
}

Assert-DatabaseConnectionInfo $postgres -RequireDatabaseName

function Uninstall-Asset {
    Param(
        [Parameter(Mandatory = $true)]
        [string] $app
    )

    $folderPath = (Join-Path $packagesPath "edfi.buzz.$($app.ToLowerInvariant())")

    $matchingFolders = (gci -Path $global:packagesPath | ? { $_.Name -like "edfi.buzz.$($app.ToLowerInvariant())*"}) | Select-Object -Property FullName

    if ($matchingFolders.Length -lt 1) {
        Write-Host "$app has not been installed yet."
        exit;
    }

    Write-Host "Uninstalling Ed-Fi Buzz $app"
    # Stop-Service -Name "EdFi-Buzz-$app"
    # Delete-Service -Name "EdFi-Buzz-$app"
    Write-Host "Removing app folder at $($matchingFolders[0].FullName)"
    Remove-Item -Path $matchingFolders[0].FullName -Recurse -Force
}

function Execute-AppInstaller {
    Param(
        [Parameter(Mandatory=$true)]
        [string] $app
    )

    Write-Host "Installing the Buzz $app application..."

    $matchingFolders = (gci -Path $global:packagesPath | ? { $_.Name -like "edfi.buzz.$($app.ToLowerInvariant())*"}) | Select-Object -Property FullName

    if ($matchingFolders.Length -ne 1) {
        throw "More than one $app folder found at $global:packagesPath"
    }

    $installFolder = Join-Path $matchingFolders[0].FullName "Windows"

    Write-Host "Moving to $installFolder to install"
    Push-Location $installFolder
    Write-Host "Installing $app..."
    & .\install.ps1
    Write-Host "Buzz $app installed."
    Pop-Location
}

function Install-AssetFromNuget($app, $packageName, $version = "", $source = $script:artifactRepo) {

    Uninstall-Asset($app)

    if ($version -eq "latest") {
        & $script:nuget "install" $packageName -Source "$source" -OutputDirectory "$packagesPath"
    }
    else {
        & $script:nuget "install" $packageName -Version $version -Source "$source" -OutputDirectory "$packagesPath"
    }

    Execute-AppInstaller -app $app
}



# Install Buzz Database - downloads and executes the database install script


# Install API - downloads the parameterized version (latest as default) and executes the API install script

# Install ETL - downloads the parameterized version (latest as default) and executes the ETL install script
Install-AssetFromNuget -app "Etl" -packageName "edfi.buzz.etl" -version $conf.etl.version -source $conf.artifactRepo


# Install UI - downloads the parameterized version (latest as default) and executes the UI install script

# Verify all services are running

exit $LASTEXITCODE;
