# SPDX-License-Identifier: Apache-2.0
# Licensed to the Ed-Fi Alliance under one or more agreements.
# The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
# See the LICENSE and NOTICES files in the project root for more information.

#requires -version 5

# NB: must have Ed-Fi-ODS-Implementation as a peer to the Fix-It-Friday
# repo directory, sourced from https://github.com/Ed-Fi-Alliance-OSS

param(
    [string]
    [validateset("debug", "release")]
    $Configuration = "debug",

    [string]
    [Parameter(Mandatory=$true)]
    $Version,

    [string]
    $BuildCounter = "",

    [string]
    $AppCommonPackageVersion = "1.0.0-pre1055"
)

$ErrorActionPreference = "Stop"

function Invoke-DotnetPack {
    param (
        [string]
        [Parameter(Mandatory=$true)]
        $PackageVersion
    )

    $parameters = @(
        "pack", "../FixItFriday.Api/FixItFriday.Api.csproj",
        "-p:PackageVersion=$PackageVersion"
        "-p:NuspecFile=$(Resolve-Path "$PSScriptRoot/EdFi.FixItFriday.Installer.nuspec")",
        "-p:NuspecProperties=\""Configuration=$Configuration;Version=$PackageVersion\""",
        "--no-build",
        "--no-restore",
        "--output", "$PSScriptRoot/dist",
        # Suppress warnings about script files not being recognized and executed
        "-nowarn:NU5111,NU5110"
    )

    write-host @parameters

    dotnet @parameters
}

function New-EdFiDirectories {
    # This is a hack for TeamCity - create empty ODS and Implementation directories so that
    # the path resolver will be satified. When run locally this should have no impact.
    New-Item -ItemType Directory -Path "$edFiRepoContainer/Ed-Fi-ODS" -Force | Out-Null
    New-Item -ItemType Directory -Path "$edFiRepoContainer/Ed-Fi-ODS-Implementation" -Force | Out-Null
}

function Invoke-DownloadAppCommon {
    # Download App Common
    $parameters = @{
        PackageName = "EdFi.Installer.AppCommon"
        PackageVersion = $AppCommonPackageVersion
        ToolsPath = "../tools"
    }

    Get-NugetPackage @parameters
}

function Copy-AppCommonFilesIntoEdFiDirectories {
    param (
        [string]
        $AppCommonDirectory
    )

    # Copy Ed-Fi-XYZ folders from App Common folder to current
    @(
        "Ed-Fi-Common"
        "Ed-Fi-ODS"
        "Ed-Fi-ODS-Implementation"
    ) | ForEach-Object {
        Copy-Item -Recurse -Path $appCommonDirectory/$_ -Destination $PsScriptRoot -Force
    }

    # Move AppCommon's modules into Ed-Fi-Common so that they are discoverable with pathresolver
    @(
        "Application"
        "Environment"
        "IIS"
    ) | ForEach-Object {
        $parameters = @{
            Recurse = $true
            Force = $true
            Path = "$appCommonDirectory/$_"
            Destination = "$PSScriptRoot/Ed-Fi-Common/logistics/scripts/modules"
        }
        Copy-Item @parameters
    }
}

$env:PathResolverRepositoryOverride = "Ed-Fi-Common;Ed-Fi-Ods;Ed-Fi-ODS-Implementation;"
Import-Module -Force -Scope Global "$PsScriptRoot/../../Ed-Fi-ODS-Implementation/logistics/scripts/modules/path-resolver.psm1"
Import-Module -Force $folders.modules.invoke("packaging/nuget-helper.psm1")

New-EdFiDirectories
$appCommonDirectory = Invoke-DownloadAppCommon
Copy-AppCommonFilesIntoEdFiDirectories $appCommonDirectory

Invoke-DotnetPack -PackageVersion "$Version-pre$($BuildCounter.PadLeft(4,'0'))"
Invoke-DotnetPack -PackageVersion "$Version"
