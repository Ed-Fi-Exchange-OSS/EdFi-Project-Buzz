# SPDX-License-Identifier: Apache-2.0
# Licensed to the Ed-Fi Alliance under one or more agreements.
# The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
# See the LICENSE and NOTICES files in the project root for more information.

Import-Module "$PSScriptRoot\AppSharedLibrary\nuget-helper.psm1"

$root = $PSScriptRoot

$AppCommonVersion = "1.0.3"
function Install-AppCommon {
    Param(
        [Parameter(Mandatory = $true)]
        [string] $toolsPath,
        [Parameter(Mandatory = $true)]
        [string] $packageSource,
        [Parameter(Mandatory = $true)]
        [string] $downloadPath,
        [Parameter(Mandatory = $true)]
        [string] $version
    )
    try {
        $packageName = "EdFi.Installer.AppCommon"
        $installerPath = Join-Path $packagesPath "$packageName.$version"

        if (-not (Test-Path $installerPath)) {
            $installerPath = Install-EdFiPackage -packageName $packageName -version $version -packageSource $packageSource -downloadPath $downloadPath
        }

        $env:PathResolverRepositoryOverride = "Ed-Fi-Ods;Ed-Fi-ODS-Implementation"
        Write-Host "Importing $packageName modules..."
        Import-Module -Force -Scope Global "$installerPath/Ed-Fi-ODS-Implementation/logistics/scripts/modules/path-resolver.psm1" -ErrorAction Continue
        Import-Module -Force $folders.modules.invoke("packaging/nuget-helper.psm1") -ErrorAction Continue
        Import-Module -Force $folders.modules.invoke("tasks/TaskHelper.psm1") -ErrorAction Continue
        Import-Module -Force $folders.modules.invoke("tools/ToolsHelper.psm1") -ErrorAction Continue

        # Import the following with global scope so that they are available inside of script blocks
        Import-Module -Force "$installerPath/Application/Install.psm1" -Scope Global -ErrorAction Continue
        Import-Module -Force "$installerPath/Application/Configuration.psm1" -Scope Global -ErrorAction Continue

        Write-Host "$packageName installed."
    }
    catch {
        Write-Host "Error on Installer-AppCommon"
        Write-Host $_.ScriptStackTrace
    }
}

function Install-NugetCli {
    Param(
        [Parameter(Mandatory = $true)]
        [string] $toolsPath,
        [string] $sourceNugetExe = "https://dist.nuget.org/win-x86-commandline/v5.3.1/nuget.exe"
    )

    if (-not $(Test-Path $toolsPath)) {
        mkdir $toolsPath | Out-Null
    }

    Copy-Item -path .\nuget.config -Destination $toolsPath

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

function Ensure-NodeJs {

    try {
        Write-Host "Check for NodeJs"

        if (Get-Command node -errorAction SilentlyContinue) {
            $nodeVer = node -v
        }

        if ($nodeVer) {
            write-host "Nodejs $nodeVer already installed"

            $node_version_number = [int]$nodeVer.substring(1, 2);

            if ($node_version_number -lt 12) {
                Write-Error "Nodejs version installed is not supported. Please install version 12 or higher"
                exit -1;
            }

            return;
            exit 0;
        }
    }
    catch {
        Write-Host "Error on Ensure-NodeJs"
        Write-Host $_.ScriptStackTrace
        exit -1
    }
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
        [Parameter(Mandatory = $true)]
        [string] $packagesPath
    )

    Install-NugetCli -toolsPath  $toolsPath
    Install-AppCommon -toolsPath $toolsPath -packageSource "https://www.myget.org/F/ed-fi/" -downloadPath $packagesPath -version $script:AppCommonVersion
    Ensure-NodeJs
}

Export-ModuleMember Initialize-Installer
