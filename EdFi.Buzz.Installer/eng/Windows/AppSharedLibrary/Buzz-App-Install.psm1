# SPDX-License-Identifier: Apache-2.0
# Licensed to the Ed-Fi Alliance under one or more agreements.
# The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
# See the LICENSE and NOTICES files in the project root for more information.

$npm = "C:\Program Files\nodejs\npm.cmd"

function Initialize-InstallDirs {
    if (-not $(Test-Path $packagesPath)) {
        mkdir $packagesPath | Out-Null
    }

    if (-not $(Test-Path $toolsPath)) {
        mkdir $toolsPath | Out-Null
    }
}

function Get-FileNameWithoutExtensionFromUrl {
    param(
        [string]
        $Url
    )

    if (($Url -match "([a-zA-Z0-9\.\-]+)\.zip")) {
        return $Matches[1];
    }

    throw "Unable to parse file name from $Url"
}

function Get-HelperAppIfNotExists {
    param(
        [string]
        $Url,
        [string]
        $targetLocation
    )
    $version = Get-FileNameWithoutExtensionFromUrl -Url $Url

    if (-not (Test-Path -Path "$targetLocation\$version")) {
        $outFile = ".\$version.zip"
        Invoke-WebRequest -Uri $Url -OutFile $outFile

        Expand-Archive -Path $outFile

        if ((Test-Path -Path "$version\$version")) {
            Move-Item -Path "$version\$version" -Destination $targetLocation
            Remove-Item -Path $version
        }
        else {
            Move-Item -Path "$version" -Destination $targetLocation
        }
    }

    return $version
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

function Assert-NodeJs {
    Write-Host "Check for NodeJs"

    if (Get-Command node -errorAction SilentlyContinue) {
        $nodeVer = node -v
    }

    if ($nodeVer) {
        $node_version_number = [int]$nodeVer.substring(1, 2);
        Write-Host "Nodejs $node_version_number is installed"

        if ($node_version_number -lt 12) {
            throw "Nodejs version installed is not supported. Please install version 12 or higher"
        }
    }


    if (Get-Command npm -errorAction SilentlyContinue) {
        $npmVer = npm
    }

    if ($npmVer) {
        Write-Host "NPM is installed"
    }
    else {
        throw "NPM is not installed"
    }

}

<#
 Initializes the installing machine
 Ensures we have NuGet Package Provider
 Verifies PostgreSQL database
 #>
function Initialize-AppInstaller {
    Param(
        [Parameter(Mandatory = $true)]
        [string] $toolsPath,
        [Parameter(Mandatory = $true)]
        [string] $packagesPath
    )

    Write-Host "Starting Initialize-AppInstaller ..."


    Write-Host "Initialize-AppInstaller complete."
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

    Write-Host "Starting Initialize-Installer ..."

    Initialize-InstallDirs
    Install-NugetCli -toolsPath  $toolsPath
    Assert-NodeJs

    Write-Host "Initialize-Installer complete."
}

function New-DotEnvFile {
    param(
        [string]
        $appPath,
        [string] $fileContents
    )

    New-Item -Path "$appPath/.env" -ItemType File -Force | Out-Null

    $fileContents | Out-File "$appPath\.env" -Encoding UTF8 -Force
}

function Install-NpmPackages {
    param (
        [Parameter(Mandatory = $true)]
        [string]
        $appPath
    )
    try {
        Write-Host "Installing NPM packages..." -ForegroundColor Green
        Push-Location $appPath
        & $script:npm install --production --silent
    }
    catch {
        Write-Error "Error on npm install"
        Write-Error $PSItem.Exception.Message
        Write-Error $PSItem.Exception.StackTrace
    }
    finally {
        Pop-Location
    }
}

function Install-NginxService {
    param(
        [string]
        $nginxVersion,
        [string]
        $winSwVersion,
        [string]
        $webSitePath,
        [string]
        $app
    )

    $serviceName = "EdFi-Buzz-$($app)"

    # If service already exists, stop and remove it so that new settings
    # will be applied.
    $exists = Get-Service -name $serviceName -ErrorAction SilentlyContinue

    if ($exists) {
        Stop-Service -name $serviceName
        &sc.exe delete $serviceName
    }

    # Rename WindowsService.exe to EdFiBuzzUi.exe
    $winServiceExe = "$webSitePath\$winSwVersion\WindowsService.exe"
    $edFiBuzzExe = "$webSitePath\$winSwVersion\EdFiBuzz$($app).exe"
    if ((Test-Path -Path "$webSitePath\$winSwVersion\WindowsService.exe")) {
        Move-Item -Path $winServiceExe -Destination $edFiBuzzExe
    }

    # Copy the config XML file to install directory
    $xmlFile = "$webSitePath\$winSwVersion\EdFiBuzz$($app).xml"
    $currDir = Get-Location
    Copy-Item -Path "$currDir\EdFiBuzz$($app).xml" -Destination $xmlFile -Force

    # Inject the correct path to nginx.exe into the config XML file
    $content = Get-Content -Path $xmlFile -Encoding UTF8
    $content = $content.Replace("{0}", "$webSitePath\$nginxVersion")
    $content | Out-File -FilePath $xmlFile -Encoding UTF8 -Force

    # Create and start the service
    &$edFiBuzzExe install
    &$edFiBuzzExe start
}

function Install-NodeService {
    param(
      [string] $winSwVersion,
      [string] $InstallPath,
      [string] $app
    )

    $serviceName = "EdFi-Buzz-$app"

    # If service already exists, stop and remove it so that new settings
    # will be applied.
    $exists = Get-Service -name $serviceName -ErrorAction SilentlyContinue

    if ($exists) {
      Stop-Service -name $serviceName
      &sc.exe delete $serviceName
    }

    # Rename WindowsService.exe to BuzzApi.exe
    $winServiceExe = "$InstallPath\$winSwVersion\WindowsService.exe"
    $edFiBuzzExe = "$InstallPath\$winSwVersion\EdFiBuzz$app.exe"
    if ((Test-Path -Path "$InstallPath\$winSwVersion\WindowsService.exe")) {
      Move-Item -Path $winServiceExe -Destination $edFiBuzzExe
    }

    # Copy the config XML file to install directory
    $xmlFile = "$InstallPath\$winSwVersion\EdFiBuzz$app.xml"
    $currDir = Get-Location
    Copy-Item -Path "$currDir\EdFiBuzz$app.xml" -Destination $xmlFile -Force

    # Inject the correct path to nginx.exe into the config XML file
    $content = Get-Content -Path $xmlFile -Encoding UTF8
    $content = $content.Replace("{0}", "$InstallPath")
    $content | Out-File -FilePath $xmlFile -Encoding UTF8 -Force

    # Create and start the service
    &$edFiBuzzExe install
    &$edFiBuzzExe start
  }

function Install-NginxFiles {
    param(
        [string]
        $nginxVersion,
        [string]
        $webSitePath,
        [string]
        $fileContents,
        [string]
        $nginxPort,
        [string]
        $rootDir
    )

    New-Item -ItemType Directory -Path "$webSitePath\$nginxVersion\" -ErrorAction SilentlyContinue

    $currDir = Get-Location

    # Copy the build directory into the NGiNX folder
    $parameters = @{
        Path        = "$currDir\..\$rootDir"
        Destination = "$webSitePath\$nginxVersion\"
        Recurse     = $true
        Force       = $true
    }
    Copy-Item @parameters

    Update-NginxConf -sourcePath "$($currDir)\..\" -appPath "$webSitePath\$nginxVersion\conf" -rootDir $rootDir -nginxPort $nginxPort
}

function Update-WebConfig {
    param(
        [string]
        $appPath,
        [string]
        $nginxPort
    )

    $fileContents = (Get-Content -Path "$appPath/web.config" -Encoding UTF8).Replace("%NGINXPORT%", $nginxPort)
    $fileContents | Set-Content "$appPath/web.config"
}

function Update-NginxConf {
    param(
        [string]
        $appPath,
        [string]
        $sourcePath,
        [string]
        $nginxPort,
        [string]
        $rootDir
    )

    $fileContents = (Get-Content -Path "$sourcePath/nginx.conf" -Encoding UTF8)
    $fileContents = $fileContents.Replace("%NGINXPORT%", $nginxPort)
    $fileContents = $fileContents.Replace("%WEBROOT%", "./$rootDir")
    $nginxFile = New-Item -Path "$appPath/nginx.conf" -Force -ErrorAction Continue
    $fileContents | Set-Content $nginxFile
}

$variables = @(
    "npm"
)

$functions = @(
    "Assert-NodeJs"
    "Initialize-InstallDirs"
    "Get-FileNameWithoutExtensionFromUrl"
    "Get-HelperAppIfNotExists"
    "New-DotEnvFile"
    "Initialize-AppInstaller"
    "Initialize-Installer"
    "Install-NodeService"
    "Install-NpmPackages"
    "Install-NginxService"
    "Install-NginxFiles"
    "Update-WebConfig"
    "Update-NginxConf"
)

Export-ModuleMember -Variable $variables -Function $functions
