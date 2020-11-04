# SPDX-License-Identifier: Apache-2.0
# Licensed to the Ed-Fi Alliance under one or more agreements.
# The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
# See the LICENSE and NOTICES files in the project root for more information.

#Requires -version 5
#Requires -RunAsAdministrator

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
        [Parameter(Mandatory = $false)]
        [string] $version
    )

    try {

        Write-Host "Downloading the package for Buzz $app application ..."

        $packageName = "edfi.buzz.$($app.ToLowerInvariant())"

        $installparams = @{
            packageName   = $packageName
            version       = $version
            toolsPath     = $configuration.toolsPath
            downloadPath  = $packagesPath
            packageSource = $configuration.artifactRepo
        }

        Import-Module "./AppSharedLibrary/nuget-helper.psm1" -Force -Scope Local
        $installFolder = Install-EdFiPackage @installparams
        Copy-Item -Path "./AppSharedLibrary/Buzz-App-Install.psm1" -Destination (Join-Path $installFolder "Windows") -Force
        Copy-Item -Path "./AppSharedLibrary/nuget-helper.psm1" -Destination (Join-Path $installFolder "Windows") -Force

        Write-Host "Moving to $installFolder to install"
        Write-Host "Running package installation for $app..."
        Push-Location (Join-Path $installFolder "Windows")
        & ./install.ps1 @params
        Write-Host "Package installation completed for $app."
    }
    catch {
        Write-Host $_
        throw $_
    }
    finally {
        Pop-Location
    }
}

function Install-ApiApp {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory = $true)]
        [Hashtable] $configuration,
        [Parameter(Mandatory = $true)]
        [string] $packagesPath,
        [Parameter(Mandatory = $true)]
        [string] $toolsPath
    )

    if (-not $configuration.installApi) {
        Write-Host "Skipping Buzz API installation"
        return;
    }

    $params = @{
        "InstallPath"        = Join-Path $configuration.InstallPath "API";
        "DbServer"           = $configuration.postgresDatabase.host;
        "DbPort"             = $configuration.postgresDatabase.port;
        "DbUserName"         = $configuration.postgresDatabase.username;
        "DbPassword"         = $configuration.postgresDatabase.password;
        "DbName"             = $configuration.postgresDatabase.database;
        "idProvider"         = $configuration.idProvider;
        "uriDiscovery"       = "";
        "googleClientID"     = $configuration.googleClientID;
        "clientSecret"       = $configuration.clientSecret;
        "googleAuthCallback" = $configuration.api.url;
        "surveyFilesFolder"  = $configuration.api.surveyFilesFolder;
        "port"               = $configuration.api.Port;
        "toolsPath"          = $toolsPath;
        "packagesPath"       = $packagesPath;
        "nginxPort"          = $configuration.api.nginxPort;
        "SqlServerHost"      = $configuration.sqlServerDatabase.host;
        "SqlServerPort"      = $configuration.sqlServerDatabase.port;
        "SqlServerUserName"  = $configuration.sqlServerDatabase.username;
        "SqlServerPassword"  = $configuration.sqlServerDatabase.password;
        "SqlServerDbName"    = $configuration.sqlServerDatabase.database;
        "KeepSurveysSynch"   = $configuration.keepSurveysSynch;
        "rootDir"            = "dist";
        "app"                = "API";
    }

    if ("google" -eq $configuration.idProvider) {
        $params.uriDiscovery = "https://accounts.google.com/.well-known/openid-configuration"
    }
    else {
        $params.uriDiscovery = "https://login.microsoftonline.com/common/.well-known/openid-configuration"
    };

    $buzzAppParams = @{
        skipFlag      = $configuration.installApi
        app           = "API"
        configuration = $configuration
        packagesPath  = $packagesPath
        params        = $params
        version       = $configuration.api.version
    }

    Install-BuzzApp @buzzAppParams
}

function Install-DatabaseApp {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory = $true)]
        [Hashtable]$configuration,
        [Parameter(Mandatory = $true)]
        [string] $packagesPath,
        [Parameter(Mandatory = $true)]
        [string] $toolsPath
    )

    if (-not $configuration.installDatabase) {
        Write-Host "Skipping Buzz Database installation"
        return;
    }

    $params = @{
        "DbServer"          = $configuration.postgresDatabase.host;
        "DbPort"            = $configuration.postgresDatabase.port;
        "DbUserName"        = $configuration.postgresDatabase.username;
        "DbPassword"        = $configuration.postgresDatabase.password;
        "DbName"            = $configuration.postgresDatabase.database;
        "LoadSampleData"    = $configuration.loadSampleData;
    }

    Install-BuzzApp -skipFlag $configuration.installDatabase -app "Database" -configuration $configuration -packagesPath $packagesPath -params $params -version $configuration.database.version
}

function Install-UiApp {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory = $true)]
        [Hashtable] $configuration,
        [Parameter(Mandatory = $true)]
        [string] $packagesPath,
        [Parameter(Mandatory = $true)]
        [string] $toolsPath
    )

    if (-not $configuration.installUi) {
        Write-Host "Skipping Buzz UI installation"
        return;
    }

    $params = @{
        "InstallPath"     = Join-Path $configuration.InstallPath "UI";
        "port"            = $configuration.ui.port;
        "graphQlEndpoint" = $configuration.ui.graphQlEndpoint;
        "idProvider"      = $configuration.idProvider;
        "googleClientId"  = $configuration.googleClientId;
        "adfsClientId"    = $configuration.adfsClientId;
        "adfsTenantId"    = $configuration.adfsTenantId;
        "logo"            = $configuration.ui.logo;
        "externalLogo"    =	$configuration.ui.externalLogo;
        "logoWidth"       =	$configuration.ui.logoWidth;
        "title"           = $configuration.ui.title;
        "titleLogo"       = $configuration.ui.titleLogo;
        "titleLogoWidth"  = $configuration.ui.titleLogoWidth;
        "titleLogoHeight" = $configuration.ui.titleLogoHeight;
        "toolsPath"       = $toolsPath;
        "packagesPath"    = $packagesPath;
        "rootDir"         = "build";
        "app"             = "UI";
    }

    $buzzAppParams = @{
        skipFlag      = $configuration.installUi
        app           = "UI"
        configuration = $configuration
        packagesPath  = $packagesPath
        params        = $params
        version       = $configuration.ui.version
    }

    Install-BuzzApp @buzzAppParams
}

function Install-EtlApp {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory = $true)]
        [Hashtable] $configuration,
        [Parameter(Mandatory = $true)]
        [string] $packagesPath,
        [Parameter(Mandatory = $true)]
        [string] $toolsPath
    )

    if (-not $configuration.installEtl) {
        Write-Host "Skipping Buzz ETL installation"
        return;
    }

    $params = @{
        "InstallPath"       = Join-Path $configuration.InstallPath "Etl";
        "SqlServerHost"     = $configuration.sqlServerDatabase.host;
        "SqlServerPort"     = $configuration.sqlServerDatabase.port;
        "SqlServerUserName" = $configuration.sqlServerDatabase.username;
        "SqlServerPassword" = $configuration.sqlServerDatabase.password;
        "SqlServerDbName"   = $configuration.sqlServerDatabase.database;
        "PostgresHost"      = $configuration.postgresDatabase.host;
        "PostgresPort"      = $configuration.postgresDatabase.port;
        "PostgresUserName"  = $configuration.postgresDatabase.username;
        "PostgresPassword"  = $configuration.postgresDatabase.password;
        "PostgresDbName"    = $configuration.postgresDatabase.database;
        "keepSurveysSynch"  = $configuration.keepSurveysSynch;
        "packagesPath"      = $packagesPath;
    }

    $buzzAppParams = @{
        skipFlag      = $configuration.installEtl
        app           = "Etl"
        configuration = $configuration
        packagesPath  = $packagesPath
        params        = $params
        version       = $configuration.ui.version
    }

    Install-BuzzApp @buzzAppParams
}

function Get-WebStatus {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory = $true)]
        [string]
        $url
    )

    try {
        $status = "Not running"
        $global:ProgressPreference = 'SilentlyContinue'
        $request = (Invoke-WebRequest -Uri $url -UseBasicParsing )
        if ($request.StatusCode) {
            $status = "Status code returned: " + $request.StatusCode
        }
        $global:ProgressPreference = 'Continue'
    }
    catch {

    }
    return $status
}

function Check-Service {
    [CmdletBinding()]
    param (
        [Parameter()]
        [string]
        $app
    )
    $status = "Not installed"
    if (Get-Service -Name "EdFi-Buzz-$app" -ErrorAction SilentlyContinue) {
        $status = (Get-Service -Name "EdFi-Buzz-$app" -ErrorAction SilentlyContinue).Status
    }
    return $status
}

function Test-BuzzServices {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory = $true)]
        [Hashtable]
        $conf
    )

    $services = @{}

    if ($conf.installEtl -eq $true) {
        $etl = Check-Service -app "etl"
        $services.Add("Ed-Fi Buzz ETL Service", $etl)
    }

    if ($conf.installApi -eq $true) {
        $api = Check-Service -app "api"
        $services.Add("Ed-Fi Buzz API Service", $api)
        $services.Add("Ed-Fi Buzz API Website", (Get-WebStatus -url $conf.api.url))
    }

    if ($conf.installUi -eq $true) {
        $ui = Check-Service -app "ui"
        $services.Add("Ed-Fi Buzz UI Service", $ui)
        $services.Add("Ed-Fi Buzz UI Website", (Get-WebStatus -url $conf.ui.url))
    }

    if ($services.Count -eq 0) {
        return
    }

    Write-Host "Checking Ed-Fi Buzz App Services and Webs statuses ..." -ForegroundColor Yellow
    $services | Format-Table
}

$functions = @(
    "Execute-AppInstaller",
    "Install-ApiApp",
    "Install-DatabaseApp",
    "Install-EtlApp",
    "Install-UiApp",
    "Test-BuzzServices"
)

Export-ModuleMember $functions
