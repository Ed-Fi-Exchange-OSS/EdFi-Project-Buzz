# SPDX-License-Identifier: Apache-2.0
# Licensed to the Ed-Fi Alliance under one or more agreements.
# The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
# See the LICENSE and NOTICES files in the project root for more information.

#Requires -version 5
#Requires -RunAsAdministrator

function Uninstall-BuzzAppService {
    Param(
        [Parameter(Mandatory = $true)]
        [string] $app
    )

    if ($app -eq "Database") {
        Write-Debug "Uninstall-Services skipping database service uninstall"
        return;
    }

    try {

        $serviceName = "EdFi-Buzz-$app"

        if (Get-Service -Name $serviceName -ErrorAction Ignore) {
            Write-Host "Removing Buzz server $serviceName"
            &sc.exe stop $ServiceName
            &sc.exe delete $ServiceName
        }
    }
    catch {

    }
}

function Uninstall-BuzzApp {
    Param(
        [Parameter(Mandatory = $true)]
        [string] $app,
        [Parameter(Mandatory = $true)]
        [string] $appPath
    )

    try {
        Write-Host "Uninstalling prior installation of $app"

        $buzzAppDir = Join-Path $appPath $app -ErrorAction SilentlyContinue

        switch ($app) {
            "Database" { }
            "UI" {
                if (-not (Test-Path $buzzAppDir -ErrorAction SilentlyContinue)) {
                    Write-Host "$app is not installed"
                }
                Uninstall-BuzzAppService -app $app

                Write-Host "Removing app folder at $buzzAppDir"
                Remove-Item -LiteralPath $buzzAppDir -Force -Recurse -ErrorAction SilentlyContinue
            }
            "API"{
                if (-not (Test-Path $buzzAppDir -ErrorAction  SilentlyContinue)) {
                    Write-Host "$app is not installed"
                }
                Uninstall-BuzzAppService -app $app

                Write-Host "Removing app folder at $buzzAppDir"
                Remove-Item -LiteralPath $buzzAppDir -Force -Recurse -ErrorAction SilentlyContinue
            }
            Default {
                Uninstall-BuzzAppService -app $app
            }
        }

        if (Test-Path $appPath -ErrorAction Ignore) {
            Write-Host "Removing app folder at $appPath"
            Remove-Item -LiteralPath $appPath -Force -Recurse -ErrorAction SilentlyContinue
        }
    }
    catch {
        Write-Error $PSItem.Exception.Message
        throw
    }
}

$functions = @(
    "Uninstall-BuzzApp"
)

Export-ModuleMember $functions
