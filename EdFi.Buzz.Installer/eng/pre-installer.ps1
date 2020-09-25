# SPDX-License-Identifier: Apache-2.0
# Licensed to the Ed-Fi Alliance under one or more agreements.
# The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
# See the LICENSE and NOTICES files in the project root for more information.

#requires -version 5
param (
    [string]
    [Parameter(Mandatory=$true)]
    $PackageDirectory
)
$ErrorActionPreference = "Stop"

Push-Location $PackageDirectory

$dependencyVersions = @{
    AppCommon = "1.0.3"
}

<#
# This is a hack for TeamCity - create empty ODS and Implementation directories so that
# the path resolver will be satified. When run locally this should have no impact.
$edFiRepoContainer = "$PackageDirectory/../.."
New-Item -ItemType Directory -Path "$edFiRepoContainer/Ed-Fi-ODS" -Force | Out-Null
New-Item -ItemType Directory -Path "$edFiRepoContainer/Ed-Fi-ODS-Implementation" -Force | Out-Null

$env:PathResolverRepositoryOverride = "Ed-Fi-Ods;Ed-Fi-ODS-Implementation;"
Import-Module -Force -Scope Global "$edFiRepoContainer/Ed-Fi-ODS-Implementation/logistics/scripts/modules/path-resolver.psm1"
#>

Import-Module -Force ".\nuget-helper.psm1"

# Download App Common
$parameters = @{
    PackageName = "EdFi.Installer.AppCommon"
    Version = $dependencyVersions.AppCommon
    DownloadPath = "C:/temp/packages"
    ToolsPath = "C:/temp/tools"
}
$appCommonDirectory = Install-EdFiPackage @parameters

# Copy Ed-Fi-XYZ folders from App Common folder to current
@(
    "Ed-Fi-ODS"
    "Ed-Fi-ODS-Implementation"
) | ForEach-Object {
    Copy-Item -Recurse -Path $appCommonDirectory/$_ -Destination $PackageDirectory -Force
}

# Move AppCommon's modules into Ed-Fi-ODS-Implementation so that they are discoverable with pathresolver
@(
    "Application"
    "Environment"
    "IIS"
) | ForEach-Object {
    $parameters = @{
        Recurse = $true
        Force = $true
        Path = "$appCommonDirectory/$_"
        Destination = "$PackageDirectory/Ed-Fi-ODS-Implementation/logistics/scripts/modules"
    }
    Copy-Item @parameters
}

Pop-Location
