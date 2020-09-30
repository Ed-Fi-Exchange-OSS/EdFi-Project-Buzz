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

function Uninstall-BuzzWebApp {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory=$true)]
        [string]
        $Websitename,
        [Parameter(Mandatory=$true)]
        [string]
        $WebApplicationName,
        [Parameter(Mandatory=$true)]
        [string]
        $WebApplicationPath
    )

    try {
        Uninstall-WebApplication -WebSiteName $websitename -WebApplicationName $WebApplicationName -WebApplicationPath $WebApplicationPath -ErrorAction Continue
    }
    catch {
        Write-Host "Encountered an error uninstalling the Buzz Web Application. Continuing..."
    }
}

function Uninstall-BuzzWebSite {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory=$true)]
        [string]
        $websitename
    )

    try {
        Uninstall-WebSite -WebSiteName $websitename
    }
    catch {
        Write-Host "Encountered an error uninstalling the Buzz WebSite. Continuing..."
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

        $inetpubBuzzDir = Join-Path "C:\inetpub\Ed-Fi\Buzz" $app -ErrorAction Ignore

        switch ($app) {
            "Database" { }
            "UI" {
                if (-not (Test-Path $inetpubBuzzDir -ErrorAction Ignore)) {
                    Write-Host "$app is not installed"
                }
                Uninstall-BuzzAppService -app $app
                Uninstall-BuzzWebApp -WebSiteName "Ed-Fi-Buzz-$app" -WebApplicationName "Buzz$app" -WebApplicationPath "C:/inetpub/Ed-Fi/Buzz/$app"
                Uninstall-BuzzWebSite -WebSiteName "Ed-Fi-Buzz-$app"

                Write-Host "Removing app folder at $inetpubBuzzDir"
                Remove-Item -LiteralPath $inetpubBuzzDir -Force -Recurse -ErrorAction Ignore
            }
            "API"{
                if (-not (Test-Path $inetpubBuzzDir -ErrorAction Ignore)) {
                    Write-Host "$app is not installed"
                }
                Uninstall-BuzzAppService -app $app
                Uninstall-BuzzWebApp -WebSiteName "Ed-Fi-Buzz-$app" -WebApplicationName "Buzz$app" -WebApplicationPath "C:/inetpub/Ed-Fi/Buzz/$app"
                Uninstall-BuzzWebSite -WebSiteName "Ed-Fi-Buzz-$app" -ErrorAction Continue

                Write-Host "Removing app folder at $inetpubBuzzDir"
                Remove-Item -LiteralPath $inetpubBuzzDir -Force -Recurse -ErrorAction Ignore
            }
            Default {
                Uninstall-BuzzAppService -app $app
            }
        }

        if (Test-Path $appPath -ErrorAction Ignore) {
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
