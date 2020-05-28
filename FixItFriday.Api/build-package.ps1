# SPDX-License-Identifier: Apache-2.0
# Licensed to the Ed-Fi Alliance under one or more agreements.
# The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
# See the LICENSE and NOTICES files in the project root for more information.

#requires -version 5

[CmdletBinding()]
param(
    [string]
    [validateset("debug", "release")]
    $Configuration = "Release",

    [string]
    [Parameter(Mandatory=$true)]
    $Version,

    [string]
    $BuildCounter = 0
)

$ErrorActionPreference = "Stop"

function Invoke-DotnetPublish {
    $parameters = @(
        "publish",
        "--configuration", $Configuration,
        "-p:version=$Version.$BuildCounter",
        "--no-build"
    )
    Write-Host "dotnet $parameters"  -ForegroundColor Magenta
    &dotnet @parameters
}

function Invoke-DotnetPack {
    param (
        [string]
        [Parameter(Mandatory=$true)]
        $PackageVersion
    )

    $parameters = @(
        "pack", "FixItFriday.Api.csproj",
        "-p:PackageVersion=$Version"
        "-p:NuspecFile=$(Resolve-Path "$PSScriptRoot/FixItFriday.Api.nuspec")",
        "-p:NuspecProperties=\""Configuration=$Configuration;Version=$PackageVersion\""",
        "--no-build",
        "--output", "$PSScriptRoot/dist",
        # Suppress warnings about script files not being recognized and executed
        "-nowarn:NU5111,NU5110,NU5100"
    )

    Write-Host "dotnet $parameters"  -ForegroundColor Magenta
    &dotnet @parameters
}


Invoke-DotnetPublish
Invoke-DotnetPack -PackageVersion "$Version-pre$($BuildCounter.PadLeft(4,'0'))"
Invoke-DotnetPack -PackageVersion "$Version"
