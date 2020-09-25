# SPDX-License-Identifier: Apache-2.0
# Licensed to the Ed-Fi Alliance under one or more agreements.
# The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
# See the LICENSE and NOTICES files in the project root for more information.

Import-Module "$PSScriptRoot\nuget-helper.psm1"

$root = $PSScriptRoot

$AppCommonVersion = "1.0.3"

function Install-AppCommon {
    Param(
        [Parameter(Mandatory = $true)]
        [string] $toolsPath,
        [Parameter(Mandatory = $true)]
        [string] $packageSource,
        [Parameter(Mandatory = $true)]
        [string] $downloadPath,
        [Parameter(Mandatory = $true)]
        [string] $version
    )

    $packageName = "EdFi.Installer.AppCommon"
    $installerPath = Join-Path $packagesPath "$packageName.$version"

    if (-not (Test-Path $installerPath)) {
        $installerPath = Install-EdFiPackage -packageName $packageName -version $version -packageSource $packageSource -downloadPath $downloadPath
    }

    $env:PathResolverRepositoryOverride = "Ed-Fi-Ods;Ed-Fi-ODS-Implementation"
    Import-Module -Force -Scope Global "$installerPath/Ed-Fi-ODS-Implementation/logistics/scripts/modules/path-resolver.psm1"
    Import-Module -Force $folders.modules.invoke("packaging/nuget-helper.psm1")
    Import-Module -Force $folders.modules.invoke("tasks/TaskHelper.psm1")
    Import-Module -Force $folders.modules.invoke("tools/ToolsHelper.psm1")

    # Import the following with global scope so that they are available inside of script blocks
    Import-Module -Force "$installerPath/Application/Install.psm1" -Scope Global
    Import-Module -Force "$installerPath/Application/Configuration.psm1" -Scope Global
}

function Install-NugetCli {
    Param(
        [Parameter(Mandatory = $true)]
        [string] $toolsPath,
        [string] $sourceNugetExe = "https://dist.nuget.org/win-x86-commandline/v5.3.1/nuget.exe"
    )

    if (-not $(Test-Path $toolsPath)) {
        mkdir $toolsPath | Out-Null
    }

    $nuget = (Join-Path $toolsPath "nuget.exe")

    if (-not $(Test-Path $nuget)) {
        Write-Host "Downloading nuget.exe official distribution from " $sourceNugetExe
        Invoke-WebRequest $sourceNugetExe -OutFile $nuget
    }
    else {
        $info = Get-Command $nuget
        Write-Host "Found nuget exe in: $toolsPath"

        if ("5.3.1.0" -ne $info.Version.ToString()) {
            Write-Host "Updating nuget.exe official distribution from " $sourceNugetExe
            Invoke-WebRequest $sourceNugetExe -OutFile $nuget
        }
    }
}
function Ensure-NodeJs {

    if (Get-Command node -errorAction SilentlyContinue) {
        $nodeVer = node -v
    }

    if ($nodeVer) {
        write-host "[NODE] nodejs $current_version already installed"
        return;
    }

    throw "[NODE] nodejs was not installed"
}

<#
 Initializes the installing machine
 Ensures we have NuGet Package Provider
 Verifies PostgreSQL database
 #>
function Initialize-Installer {
    Param(
        [Parameter(Mandatory = $true)]
        [string] $toolsPath,
        [Parameter(Mandatory = $true)]
        [string] $packagesPath,
        [Parameter(Mandatory = $true)]
        [Hashtable] $configuration
    )
    Install-NugetCli -toolsPath  $toolsPath
    Install-AppCommon -toolsPath $toolsPath -packageSource $configuration.artifactRepo -downloadPath $packagesPath -version $script:AppCommonVersion
    Ensure-NodeJs
}

Export-ModuleMember Initialize-Installer
