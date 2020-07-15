# SPDX-License-Identifier: Apache-2.0
# Licensed to the Ed-Fi Alliance under one or more agreements.
# The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
# See the LICENSE and NOTICES files in the project root for more information.

#requires -version 5

[CmdletBinding()]
param(
    [string]
    $BuildCounter = 0
)

function Read-VersionNumberFromPackageJson {
  $packageJson = Get-Content -Path "$PsScriptRoot/../package.json" | ConvertFrom-Json
  return $packageJson.version
}

function Invoke-NuGetPack{
  param(
    [string]
    [Parameter(Mandatory=$true)]
    $FullVersion
  )

  $parameters = @(
    "pack",
    "edfi.buzz.ui.angular.nuspec",
    "-version",
    $FullVersion
  )

  Write-Host "&nuget.exe" @parameters -ForegroundColor Magenta
  &nuget.exe @parameters
}

$version = Read-VersionNumberFromPackageJson
Invoke-NuGetPack -FullVersion "$version-pre$($BuildCounter.PadLeft(4,'0'))"
Invoke-NuGetPack -FullVersion $version
