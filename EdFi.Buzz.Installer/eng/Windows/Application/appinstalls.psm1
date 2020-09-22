# SPDX-License-Identifier: Apache-2.0
# Licensed to the Ed-Fi Alliance under one or more agreements.
# The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
# See the LICENSE and NOTICES files in the project root for more information.

function Uninstall-Services {
    Param(
        [Parameter(Mandatory = $true)]
        [string] $app
    )

    if ($app -eq "Database") {
        Write-Debug "Uninstall-Services skipping database service uninstall"
        return;
    }

    try {
        Stop-Service -Name EdFi-Buzz-$app
        Remove-Service -Name EdFi-Buzz-$app
    }
    catch {
        Write-Error $PSItem.Exception.Message
        throw
    }
}

function Uninstall-Asset {
    Param(
        [Parameter(Mandatory = $true)]
        [string] $app,
        [Parameter(Mandatory = $true)]
        [string] $packagesPath
    )

    try {

        $matchingFolders = (gci -Path $packagesPath | ? { $_.Name -like "edfi.buzz.$($app.ToLowerInvariant())*" }) | Select-Object -Property FullName

        if ($matchingFolders.Length -lt 1) {
            Write-Host "$app has not been installed yet."
            return;
        }

        $folder = "$($matchingFolders[0].FullName)/"
        Uninstall-Services -app $app
        Write-Host "Removing app folder at $folder"
        Remove-Item -LiteralPath $folder -Force -Recurse
    }
    catch {
        Write-Error $PSItem.Exception.Message
        throw
    }
}

function Install-ApiApp {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory = $true)]
        [Hashtable] $configuration
    )

    if (-not $configuration.installApi) {
        Write-Host "Skipping Buzz API installation"
        return;
    }

    Write-Host "Installing the Buzz API application..."

    $params = @{
        "DbServer"   = $configuration.postgresDatabase.Host;
        "DbPort"     = $configuration.postgresDatabase.Port;
        "DbUserName" = $configuration.postgresDatabase.UserName;
        "DbPassword" = $configuration.postgresDatabase.Password;
        "DbName"     = $configuration.postgresDatabase.DbName;
        "HttpPort"   = $configuration.api.Port;
    }

    ./install.ps1 @params
}
function Install-DatabaseApp {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory = $true)]
        [Hashtable]$configuration
    )

    if (-not $configuration.installDatabase) {
        Write-Host "Skipping Buzz Database installation"
        return;
    }

    Write-Host "Installing the Buzz Database application..."
    $params = @{
        "DbServer"   = $configuration.sqlServerDatabase.host;
        "DbPort"     = $configuration.sqlServerDatabase.port;
        "DbUserName" = $configuration.sqlServerDatabase.username;
        "DbPassword" = $configuration.sqlServerDatabase.password;
        "DbName"     = $configuration.sqlServerDatabase.database
    }
    ./install.ps1 @params
}

function Install-UiApp {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory = $true)]
        [Hashtable] $configuration
    )

    if (-not $configuration.installUi) {
        Write-Host "Skipping Buzz UI installation"
        return;
    }

    Write-Host "Installing the Buzz UI application..."
    $currDir = $PWD
    $params = @{
        "InstallPath"     = $currDir;
        "port"            = $configuration.ui.port;
        "graphQlEndpoint" = $configuration.api.url;
        "googleClientId"  = $configuration.googleClientId;
        "adfsClientId"    = $configuration.adfsClientId;
        "adfsTenantId"    = $configuration.adfsTenantId;
    }
    ./install @params
}

function Install-EtlApp {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory = $true)]
        [Hashtable] $configuration
    )

    if (-not $configuration.installEtl) {
        Write-Host "Skipping Buzz ETL installation"
        return;
    }

    Write-Host "Installing the Buzz ETL application..."
    $params = @{
        "InstallPath"       = $currDir;
        "PostgresHost"      = $configuration.postgresDatabase.host;
        "PostgresPort"      = $configuration.postgresDatabase.port;
        "PostgresUserName"  = $configuration.postgresDatabase.username;
        "PostgresPassword"  = $configuration.postgresDatabase.password;
        "PostgresDbName"    = $configuration.postgresDatabase.database;
        "SqlServerHost"     = $configuration.sqlServerDatabase.host;
        "SqlServerPort"     = $configuration.sqlServerDatabase.port;
        "SqlServerUserName" = $configuration.sqlServerDatabase.username;
        "SqlServerPassword" = $configuration.sqlServerDatabase.password;
        "SqlServerDbName"   = $configuration.sqlServerDatabase.database;
    }
    ./install.ps1 @params
}
function Execute-AppInstaller {
    Param(
        [Parameter(Mandatory = $true)]
        [string] $app,
        [Parameter(Mandatory = $true)]
        [string] $packagesPath,
        [Parameter(Mandatory = $true)]
        [Hashtable] $conf
    )

    try {
        Write-Host "Installing the Buzz $app application..."

        $matchingFolders = (gci -Path $packagesPath | ? { $_.Name -like "edfi.buzz.$($app.ToLowerInvariant())*" }) | Select-Object -Property FullName

        if ($matchingFolders.Length -ne 1) {
            throw "More than one $app folder found at $packagesPath"
        }

        $installFolder = Join-Path $matchingFolders[0].FullName "Windows"

        Write-Host "Moving to $installFolder to install"
        Write-Host "Installing $app..."
        Set-Location $installFolder
        Write-Host "Current directory is now $PWD"
        switch ($app) {
            "API" { Install-ApiApp $conf }
            "Database" { Install-DatabaseApp $conf }
            "Etl" { Install-EtlApp  $conf }
            "Ui" { Install-UiApp $conf }
            Default { Write-Error "There is no Buzz $app app to install" }
        }
        Write-Host "Buzz $app installed."
    }
    catch {
        Write-Error $PSItem.Exception.Message
        throw
    }
    finally {
        Write-Debug "Move back to installer directory $currDir...."
        Set-Location $currDir
    }
}

function Install-AssetFromNuget {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory = $true)]
        [string] $nuget,
        [Parameter(Mandatory = $true)]
        [string] $app,
        [Parameter(Mandatory = $true)]
        [string] $packageName,
        [Parameter(Mandatory = $true)]
        [string] $version,
        [Parameter(Mandatory = $true)]
        [string] $source,
        [Parameter(Mandatory = $true)]
        [string] $packagesPath,
        [Parameter(Mandatory = $true)]
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
        Write-Host "Finished installing $app"
    }
    catch {
        Write-Error $PSItem.Exception.Message
        Write-Error $PSItem.Exception.StackTrace
        throw
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
