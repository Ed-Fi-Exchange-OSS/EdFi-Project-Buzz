# SPDX-License-Identifier: Apache-2.0
# Licensed to the Ed-Fi Alliance under one or more agreements.
# The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
# See the LICENSE and NOTICES files in the project root for more information.

[CmdletBinding()]
param(
    [string]
    $BuildCounter = 0,
    [string]
    $version = "0.1.0"
)

function Invoke-NuGetPack {
  param(
    [string]
    [Parameter(Mandatory=$true)]
    $FullVersion
  )

  $parameters = @(
    "pack",
    "edfi.buzz.nuspec",
    "-version",
    $FullVersion
  )

  Write-Host "&nuget.exe" @parameters -ForegroundColor Magenta
  &nuget.exe @parameters
}

Invoke-NuGetPack -FullVersion "$version-pre$($BuildCounter.PadLeft(4,'0'))"
Invoke-NuGetPack -FullVersion $version
