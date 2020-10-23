# SPDX-License-Identifier: Apache-2.0
# Licensed to the Ed-Fi Alliance under one or more agreements.
# The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
# See the LICENSE and NOTICES files in the project root for more information.

#requires -version 5

[CmdletBinding()]
param(
  [string] $VersionCore = "0.1.0",
  [string] $PrereleasePrefix = "-pre",
  [string] $BuildCounter = 0
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
    "edfi.buzz.ui.nuspec",
    "-version",
    $FullVersion
  )

  Write-Host "&nuget.exe" @parameters -ForegroundColor Magenta
  &nuget.exe @parameters
}

function Invoke-PrepForDistribution {
  # The normal `nest build` output does not include the node modules required
  # for distribution. Convert yarn.lock to package-lock.json and copy into the
  # dist directory.
  Push-Location "$PSScriptRoot/../"
  Write-Host "Executing: npx synp -s yarn.lock" -ForegroundColor Magenta
  & npx synp -s yarn.lock -f

  if ($LASTEXITCODE -ne 0) {
    Write-Error "Lock file conversion failed."
    Pop-Location
    Exit
  }

  Move-Item -Path "package-lock.json" -Destination "./build" -Force

  # Also need a copy of package.json
  Copy-Item -Path "package.json" -Destination "./build" -Force

  Pop-Location
}

if (-not (Test-Path "$PSScriptRoot/../build")) {
  Write-Error "Run `yarn build` before calling this script"
  Exit
}

Invoke-PrepForDistribution
Invoke-NuGetPack -FullVersion "$($VersionCore)$($PrereleasePrefix)$($BuildCounter.PadLeft(4,'0'))"
Invoke-NuGetPack -FullVersion $VersionCore
