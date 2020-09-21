# SPDX-License-Identifier: Apache-2.0
# Licensed to the Ed-Fi Alliance under one or more agreements.
# The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
# See the LICENSE and NOTICES files in the project root for more information.

function Uninstall-Asset {
    Param(
        [Parameter(Mandatory = $true)]
        [string] $app,
        [Parameter(Mandatory = $true)]
        [string] $packagesPath
    )

    $matchingFolders = (gci -Path $packagesPath | ? { $_.Name -like "edfi.buzz.$($app.ToLowerInvariant())*"}) | Select-Object -Property FullName

    if ($matchingFolders.Length -lt 1) {
        Write-Host "$app has not been installed yet."
        exit;
    }

    # TODO CREATE UNINSTALL-APP FUNCTIONS
    Write-Host "Uninstalling Ed-Fi Buzz $app"
    # Stop-Service -Name "EdFi-Buzz-$app"
    # Delete-Service -Name "EdFi-Buzz-$app"
    Write-Host "Removing app folder at $($matchingFolders[0].FullName)"
    Remove-Item -Path $matchingFolders[0].FullName -Recurse -Force
}

function Install-ApiApp {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory=$true)]
        [Hashtable] $configuration
    )
    Write-Host "Installing the Buzz API application..."
}
function Install-DatabaseApp {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory=$true)]
        [Hashtable]$configuration
    )
    Write-Host "Installing the Buzz Database application..."
    $params = @{
        "DbServer" = $configuration.sqlServerDatabase.host;
        "DbPort" = $configuration.sqlServerDatabase.port;
        "DbUserName" = $configuration.sqlServerDatabase.username;
        "DbPassword" = $configuration.sqlServerDatabase.password;
        "DbName" = $configuration.sqlServerDatabase.database
    }
    .\install.ps1 @params
}

function Install-UiApp {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory=$true)]
        [Hashtable] $configuration
    )
    Write-Host "Installing the Buzz Web application..."
}

function Install-EtlApp {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory=$true)]
        [Hashtable] $configuration
    )

    Write-Host "Installing the Buzz ETL application..."
    # & .\install.ps1 -DbPassword $configuration.
}

function Execute-AppInstaller {
    Param(
        [Parameter(Mandatory=$true)]
        [string] $app,
        [Parameter(Mandatory = $true)]
        [string] $packagesPath,
        [Parameter(Mandatory = $true)]
        [Hashtable] $conf
    )

    try {
        Write-Host "Installing the Buzz $app application..."

        $matchingFolders = (gci -Path $packagesPath | ? { $_.Name -like "edfi.buzz.$($app.ToLowerInvariant())*"}) | Select-Object -Property FullName

        if ($matchingFolders.Length -ne 1) {
            throw "More than one $app folder found at $packagesPath"
        }

        $installFolder = Join-Path $matchingFolders[0].FullName "Windows"

        Write-Host "Moving to $installFolder to install"
        Write-Host "Installing $app..."
        Set-Location $installFolder
        Write-Host "Current directory is now $PWD"
        switch ($app) {
            "API" {Install-ApiApp $conf }
            "Database" {Install-DatabaseApp $conf }
            "Etl" {Install-EtlApp  $conf }
            "Ui" {Install-UiApp $conf }
            Default { Write-Error "There is no Buzz $app app to install"}
        }
        Write-Host "Buzz $app installed."
    }
    catch {
        Write-Error "Execute-AppInstaller ($app)"
    }
    finally {
        Write-Debug "Move back to installer directory $currDir...."
        Set-Location $currDir
    }
}

function Install-AssetFromNuget {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory=$true)]
        [string] $nuget,
        [Parameter(Mandatory=$true)]
        [string] $app,
        [Parameter(Mandatory=$true)]
        [string] $packageName,
        [Parameter(Mandatory=$true)]
        [string] $version,
        [Parameter(Mandatory=$true)]
        [string] $source,
        [Parameter(Mandatory=$true)]
        [string] $packagesPath,
        [Parameter(Mandatory=$true)]
        [HashTable] $conf
    )

    $currDir = $PWD

    try {
        Uninstall-Asset -app $app -packagesPath $packagesPath

        if ($version -eq "latest") {
            & $nuget "install" $packageName -Source "$source" -OutputDirectory "$packagesPath" -Verbosity quiet
        }
        else {
            & $nuget "install" $packageName -Version $version -Source "$source" -OutputDirectory "$packagesPath" -Verbosity quiet
        }
        Execute-AppInstaller -app $app -packagesPath $packagesPath -conf $conf
    }
    catch {
        Write-Error "Install-AssetFromNuget failed to install $app"
    }
    finally {
        Set-Location -Path $currDir
    }
}

$functions = @(
    "Execute-AppInstaller",
    "Install-ApiApp",
    "Install-databaseApp",
    "Install-EtlApp",
    "Install-UiApp",
    "Uninstall-Asset",
    "Install-AssetFromNuget"
)

Export-ModuleMember $functions
