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
        [string] $packagesPath
    )
    Install-AppCommon -toolsPath $toolsPath -packageSource "https://www.myget.org/F/ed-fi/" -downloadPath $packagesPath -version $script:AppCommonVersion
}

Export-ModuleMember Initialize-Installer
