# SPDX-License-Identifier: Apache-2.0
# Licensed to the Ed-Fi Alliance under one or more agreements.
# The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
# See the LICENSE and NOTICES files in the project root for more information.

function Build-Package() {
    Write-Host "** Installing dependencies" -ForegroundColor Yellow
    yarn
    Write-Host "** Building" -ForegroundColor Yellow
    yarn build
    Write-Host "** Creating package" -ForegroundColor Yellow
    Set-Location eng
    &./build-package.ps1
    Write-Host "** Copying package" -ForegroundColor Yellow
    Copy-Item *.nupkg  C:\nugetRepo\
}

function Process-Projects() {
    $locations = @(".\EdFi.Buzz.Api", ".\EdFi.Buzz.Database", ".\EdFi.Buzz.Etl", ".\EdFi.Buzz.UI")

    $locations | ForEach-Object {
        Write-Host "* Entering $PSItem" -ForegroundColor Yellow
        Push-Location $PSItem
        Build-Package
        Pop-Location
    }
}

function Clean-Directories(){

    if (-not $(Test-Path C:\nugetRepo)) {
        mkdir C:\nugetRepo | Out-Null
    }

    if (-not $(Test-Path C:\temp\packages)) {
        mkdir C:\temp\packages | Out-Null
    }

    Write-Host "* Cleaning C:\nugetRepo" -ForegroundColor Yellow
    Remove-Item -Recurse -Force C:\nugetRepo\*
    Write-Host "* Cleaning C:\temp\packages" -ForegroundColor Yellow
    Remove-Item -Recurse -Force C:\temp\packages\*
}

Clean-Directories
Process-Projects
