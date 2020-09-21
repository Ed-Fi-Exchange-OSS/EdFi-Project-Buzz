# SPDX-License-Identifier: Apache-2.0
# Licensed to the Ed-Fi Alliance under one or more agreements.
# The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
# See the LICENSE and NOTICES files in the project root for more information.

function Install-NugetCli {
    Param(
        [Parameter(Mandatory = $true)]
        [string] $toolsPath,
        [string] $sourceNugetExe = "https://dist.nuget.org/win-x86-commandline/v5.3.1/nuget.exe"
    )

    if (-not $(Test-Path $toolsPath)) {
        mkdir $toolsPath | Out-Null
    }

    $nuget = (Join-Path $toolsPath "nuget.exe")

    if (-not $(Test-Path $nuget)) {
        Write-Host "Downloading nuget.exe official distribution from " $sourceNugetExe
        Invoke-WebRequest $sourceNugetExe -OutFile $nuget
    }
    else {
        $info = Get-Command $nuget
        Write-Host "Found nuget exe in: $toolsPath"

        if ("5.3.1.0" -ne $info.Version.ToString()) {
            Write-Host "Updating nuget.exe official distribution from " $sourceNugetExe
            Invoke-WebRequest $sourceNugetExe -OutFile $nuget
        }
    }
}

function Ensure-WindowsServer2016 {
    Param(
        [Parameter(Mandatory = $true)]
        [System.Boolean] $bypass
    )

    if($bypass) {
        return
    }

    $major = [Environment]::OSVersion.Version.Major
    $osProductType = (Get-ComputerInfo).OsProductType

    if($osProductType -ne "Server" -or $major -lt 10)
    {
        throw "Please install on Windows Server minimum version 2016."
    }
}

function Ensure-NodeJs {

    if (Get-Command node -errorAction SilentlyContinue) {
        $nodeVer = node -v
    }

    if ($nodeVer) {
        write-host "[NODE] nodejs $current_version already installed"
        return;
    }

    throw "[NODE] nodejs was not installed"
}

function Ensure-PostgreSQL{

}

<#
 Initializes the installing machine
 Ensures we have NuGet Package Provider
 Verifies PostgreSQL database
 #>
function Initialize-Installer {
    Param(
        [Parameter(Mandatory = $true)]
        [string] $toolsPath,
        [Parameter(Mandatory = $false)]
        [string] $downloadPath,
        [Parameter(Mandatory = $false)]
        [string]  $databasesConfig,
        [Parameter(Mandatory = $true)]
        [System.Boolean]  $bypassCheck = $false
    )

    Ensure-WindowsServer2016 -bypass $bypassCheck
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls11 -bor [Net.SecurityProtocolType]::Tls12 -bor [Net.SecurityProtocolType]::Tls13
    Install-NugetCli $toolsPath

    Ensure-NodeJs

    # TODO ENSURE POSTGRESQL IS INSTALLED
    Ensure-PostgreSQL
}

Export-ModuleMember Initialize-Installer
