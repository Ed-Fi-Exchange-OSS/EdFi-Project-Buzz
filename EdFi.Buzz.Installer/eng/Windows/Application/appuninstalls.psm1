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
            Stop-Service -Name $serviceName
            Remove-Service -Name $serviceName
        }
    }
    catch {
        Write-Error $PSItem.Exception.Message
        throw
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

        if ($app -ne "Database") {
            Uninstall-BuzzAppService -app $app
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
