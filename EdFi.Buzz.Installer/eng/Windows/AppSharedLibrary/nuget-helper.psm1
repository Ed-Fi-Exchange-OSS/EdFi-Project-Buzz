# SPDX-License-Identifier: Apache-2.0
# Licensed to the Ed-Fi Alliance under one or more agreements.
# The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
# See the LICENSE and NOTICES files in the project root for more information.

function Install-EdFiPackage {
    param (
        $packageName,
        $version,
        $toolsPath = "C:\temp\tools",
        $downloadPath = "C:\temp\packages",
        $packageSource = 'https://www.myget.org/F/ed-fi/'
    )

    Write-Host "Install-EdFiPackage installing  $packageName..."

    if (-not $version) {
        # Lookup current "latest" version
        $latestVersion = & "$toolsPath\nuget" list -source $packageSource $packageName -prerelease
        if ($latestVersion) {
            # output is like "packageName packageVersion", split to get second part
            $parts = $latestVersion.split(' ')
            if ($parts.length -eq 2) {
                $version = $parts[1]
            }
        }
    }

    $downloadedPackagePath = Join-Path $downloadPath "$packageName.$version"

    if (Test-Path $downloadedPackagePath) {
        Write-Debug "Reusing already downloaded package for: $packageName"

        return Resolve-Path $downloadedPackagePath
    }

    $parameters = @(
        "install", $packageName,
        "-source", $packageSource,
        "-version", $version,
        "-outputDirectory", $downloadPath
        "-prerelease"
    )

    Write-Host -ForegroundColor Magenta "$toolsPath\nuget $parameters"
    & "$toolsPath\nuget" $parameters | Out-Null

    return Resolve-Path $downloadedPackagePath
}
