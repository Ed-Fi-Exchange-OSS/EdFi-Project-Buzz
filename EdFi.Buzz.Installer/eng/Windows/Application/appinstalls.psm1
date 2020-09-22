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

        $serviceName = "EdFi-Buzz-$app"

        if (Get-Service -Name $serviceName -ErrorAction Ignore) {
            Stop-Service -Name $serviceName
            Remove-Service -Name $serviceName
        }
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
        [string] $appPath
    )

    try {

        if (-not (Test-Path $appPath)) {
            Write-Host "$app has not been installed yet."
            return;
        }

        if ($app -ne "Database") {
            Uninstall-Services -app $app
        }

        if (Test-Path $appPath) {
            Write-Host "Removing app folder at $appPath"
            Remove-Item -LiteralPath $appPath -Force -Recurse -ErrorAction Ignore
        }
    }
    catch {
        Write-Error $PSItem.Exception.Message
        throw
    }
}

function Install-BuzzApp {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory = $true)]
        [bool] $skipFlag,
        [Parameter(Mandatory = $true)]
        [string] $app,
        [Parameter(Mandatory = $true)]
        [Hashtable] $configuration,
        [Parameter(Mandatory = $true)]
        [string] $packagesPath,
        [Parameter(Mandatory = $true)]
        [Hashtable] $params,
        [Parameter(Mandatory = $true)]
        [string] $nuget,
        [Parameter(Mandatory = $true)]
        [string] $version
    )

    try {

        $here = $PWD

        if (-not $skipFlag) {
            Write-Host "Skipping Buzz $app installation"
            return;
        }

        if ($params.InstallPath) {
            Uninstall-Asset -app $app -appPath $params.InstallPath
            if (-not (Test-Path $params.InstallPath)) {
                New-Item -Path $params.InstallPath -ItemType Directory
            }
        }


        Write-Host "Installing the Buzz $app application..."

        $packageName = "edfi.buzz.$($app.ToLowerInvariant())"

        if ($version -eq "latest") {
            & $nuget "install" $packageName -Source $configuration.artifactRepo -OutputDirectory "$packagesPath" -Verbosity detailed
        }
        else {
            & $nuget "install" $packageName -Version $version -Source $configuration.artifactRepo -OutputDirectory "$packagesPath" -Verbosity detailed
        }

        $matchingFolders = (gci -Path $packagesPath | ? { $_.Name -like "$packageName*" }) | Select-Object -Property FullName

        if ($matchingFolders.Length -eq 0) {
            throw "The repository did not have a NuGet package '$packageName'"
        }

        if ($matchingFolders.Length -gt 1) {
            throw "More than one $app folder found at $packagesPath"
        }

        $installFolder = Join-Path $matchingFolders[0].FullName "Windows"

        Write-Host "Moving to $installFolder to install"
        Write-Host "Installing $app..."
        Set-Location $installFolder
        Write-Host "Current directory is now $PWD"
        ./install.ps1 @params
        Write-Host "Buzz $app installed."
    }
    catch {
        throw $PSItem.Exception
    }
    finally {
        Set-Location $here
    }
}

function Install-ApiApp {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory = $true)]
        [Hashtable] $configuration,
        [Parameter(Mandatory = $true)]
        [string] $nuget
    )

    $params = @{
        "InstallPath" = Join-Path $configuration.InstallPath "Api";
        "DbServer"   = $configuration.postgresDatabase.Host;
        "DbPort"     = $configuration.postgresDatabase.Port;
        "DbUserName" = $configuration.postgresDatabase.UserName;
        "DbPassword" = $configuration.postgresDatabase.Password;
        "DbName"     = $configuration.postgresDatabase.DbName;
        "HttpPort"   = $configuration.api.Port;
    }

    Install-BuzzApp -skipFlag $configuration.installApi -app "Api" -configuration $configuration -packagesPath $packagesPath -params $params -nuget $nuget -version $configuration.api.version
}

function Install-DatabaseApp {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory = $true)]
        [Hashtable]$configuration,
        [Parameter(Mandatory = $true)]
        [string] $nuget
    )

    $params = @{
        "DbServer"   = $configuration.postgresDatabase.host;
        "DbPort"     = $configuration.postgresDatabase.port;
        "DbUserName" = $configuration.postgresDatabase.username;
        "DbPassword" = $configuration.postgresDatabase.password;
        "DbName"     = $configuration.postgresDatabase.database
    }

    Install-BuzzApp -skipFlag $configuration.installDatabase -app "Database" -configuration $configuration -packagesPath $packagesPath -params $params -nuget $nuget -version $configuration.database.version
}

function Install-UiApp {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory = $true)]
        [Hashtable] $configuration,
        [Parameter(Mandatory = $true)]
        [string] $nuget
    )

    $params = @{
        "InstallPath" = Join-Path $configuration.InstallPath "Ui";
        "port"            = $configuration.ui.port;
        "graphQlEndpoint" = $configuration.api.url;
        "googleClientId"  = $configuration.googleClientId;
        "adfsClientId"    = $configuration.adfsClientId;
        "adfsTenantId"    = $configuration.adfsTenantId;
    }

    Install-BuzzApp -skipFlag $configuration.installUi -app "UI" -configuration $configuration -packagesPath $packagesPath -params $params -nuget $nuget -version $configuration.ui.version
}

function Install-EtlApp {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory = $true)]
        [Hashtable] $configuration,
        [Parameter(Mandatory = $true)]
        [string] $nuget
    )

    $params = @{
        "InstallPath" = Join-Path $configuration.InstallPath "Etl";
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

    Install-BuzzApp -skipFlag $configuration.installEtl -app "Etl" -configuration $configuration -packagesPath $packagesPath -params $params -nuget $nuget -version $configuration.etl.version
}
function Execute-AppInstaller {
    Param(
        [Parameter(Mandatory = $true)]
        [string] $app,
        [Parameter(Mandatory = $true)]
        [string] $packagesPath,
        [Parameter(Mandatory = $true)]
        [Hashtable] $conf,
        [Parameter(Mandatory = $true)]
        [string] $nuget
    )

    try {
        switch ($app) {
            "API" { Install-ApiApp $conf -nuget $nuget }
            "Database" { Install-DatabaseApp $conf -nuget $nuget }
            "Etl" { Install-EtlApp  $conf -nuget $nuget }
            "Ui" { Install-UiApp $conf -nuget $nuget }
            Default { Write-Error "There is no Buzz $app app to install" }
        }
    }
    catch {
        throw $PSItem.Exception
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
        Execute-AppInstaller -app $app -packagesPath $packagesPath -conf $conf -nuget $nuget
    }
    catch {
        throw $PSItem.Exception
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
