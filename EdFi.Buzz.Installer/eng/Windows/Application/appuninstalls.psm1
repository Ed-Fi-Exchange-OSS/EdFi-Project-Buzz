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
        Write-Error $PSItem.Exception.Message
        Write-Host "Continuing on...."
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

        if (-not (Test-Path $appPath)) {
            Write-Host "$app has not been installed yet."
            return;
        }

        Write-Host "Uninstalling prior installation of $app"

        $inetpubBuzzDir = Join-Path "C:\inetpub\Buzz" $app

        switch ($app) {
            "Database" { }
            "UI" {
                Uninstall-BuzzAppService -app $app
                if (Test-Path $inetpubBuzzDir) {
                    Write-Host "Removing app folder at $inetpubBuzzDir"
                    Remove-Item -LiteralPath $inetpubBuzzDir -Force -Recurse -ErrorAction Ignore
                }

            }
            "API"{
                Uninstall-BuzzAppService -app $app
                if (Test-Path $inetpubBuzzDir) {
                    Write-Host "Removing app folder at $inetpubBuzzDir"
                    Remove-Item -LiteralPath $inetpubBuzzDir -Force -Recurse -ErrorAction Ignore
                }
            }
            Default {

            }
        }

        if (Test-Path $appPath) {
            Write-Host "Removing app folder at $appPath"
            Remove-Item -LiteralPath $appPath -Force -Recurse -ErrorAction Ignore
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
