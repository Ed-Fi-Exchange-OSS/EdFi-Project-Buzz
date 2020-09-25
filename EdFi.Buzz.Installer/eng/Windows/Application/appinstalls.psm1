# SPDX-License-Identifier: Apache-2.0
# Licensed to the Ed-Fi Alliance under one or more agreements.
# The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
# See the LICENSE and NOTICES files in the project root for more information.

#Requires -version 5
#Requires -RunAsAdministrator

Import-Module -Force "$PSScriptRoot/appuninstalls.psm1"

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
        [string] $version
    )

    try {

        $here = $PWD

        if (-not $skipFlag) {
            Write-Host "Skipping Buzz $app installation"
            return;
        }

        if ($params.InstallPath) {
            Uninstall-BuzzApp -app $app -appPath $params.InstallPath
            if (-not (Test-Path $params.InstallPath)) {
                New-Item -Path $params.InstallPath -ItemType Directory
            }
        }


        Write-Host "Downloading the package for Buzz $app application ($version)..."

        $packageName = "edfi.buzz.$($app.ToLowerInvariant())"

        Import-Module "$PSScriptRoot\..\nuget-helper.psm1"

        $installFolder = Install-EdFiPackage -packageName $packageName -version $version -toolsPath $toolsPath -downloadPath $packagesPath -packageSource $configuration.artifactRepo

        Write-Host "Moving to $installFolder to install"
        Write-Host "Running package installation for $app..."
        Set-Location (Join-Path $installFolder "Windows")
        ./install.ps1 @params
        Write-Host "Package installation completed for $app."
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
        [string] $packagesPath
    )

    $params = @{
        "InstallPath" = "C:\inetpub\Ed-Fi\Buzz\API";
        "DbServer"   = $configuration.postgresDatabase.Host;
        "DbPort"     = $configuration.postgresDatabase.Port;
        "DbUserName" = $configuration.postgresDatabase.UserName;
        "DbPassword" = $configuration.postgresDatabase.Password;
        "DbName"     = $configuration.postgresDatabase.DbName;
        "HttpPort"   = $configuration.api.Port;
    }

    Install-BuzzApp -skipFlag $configuration.installApi -app "Api" -configuration $configuration -packagesPath $packagesPath -params $params -version $configuration.api.version
}

function Install-DatabaseApp {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory = $true)]
        [Hashtable]$configuration,
        [Parameter(Mandatory = $true)]
        [string] $packagesPath
    )

    $params = @{
        "DbServer"   = $configuration.postgresDatabase.host;
        "DbPort"     = $configuration.postgresDatabase.port;
        "DbUserName" = $configuration.postgresDatabase.username;
        "DbPassword" = $configuration.postgresDatabase.password;
        "DbName"     = $configuration.postgresDatabase.database
    }

    Install-BuzzApp -skipFlag $configuration.installDatabase -app "Database" -configuration $configuration -packagesPath $packagesPath -params $params -version $configuration.database.version
}

function Install-UiApp {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory = $true)]
        [Hashtable] $configuration,
        [Parameter(Mandatory = $true)]
        [string] $packagesPath
    )

    $params = @{
        "InstallPath" = "C:\inetpub\Ed-Fi\Buzz\UI";
        "port"            = $configuration.ui.port;
        "graphQlEndpoint" = $configuration.api.url;
        "googleClientId"  = $configuration.googleClientId;
        "adfsClientId"    = $configuration.adfsClientId;
        "adfsTenantId"    = $configuration.adfsTenantId;
    }

    Install-BuzzApp -skipFlag $configuration.installUi -app "UI" -configuration $configuration -packagesPath $packagesPath -params $params -version $configuration.ui.version
}

function Install-EtlApp {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory = $true)]
        [Hashtable] $configuration,
        [Parameter(Mandatory = $true)]
        [string] $packagesPath
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

    Install-BuzzApp -skipFlag $configuration.installEtl -app "Etl" -configuration $configuration -packagesPath $packagesPath -params $params -version $configuration.etl.version
}

$functions = @(
    "Execute-AppInstaller",
    "Install-ApiApp",
    "Install-DatabaseApp",
    "Install-EtlApp",
    "Install-UiApp"
)

Export-ModuleMember $functions
